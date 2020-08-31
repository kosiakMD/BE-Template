var Sequelize = require('sequelize');
const { sequelize } = require('../model')

const getContract = async (req, res) => {
    const { id, type } = req.profile
    let contract = []
    let query = `select *from Contracts where id = ${req.params.id} and ${type == "client" ? "ClientId" : "ContractorId"} = ${id}`
    try {
        contract = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    } catch (e) {
        console.log(e)
    }

    res.status(200).send({
        result: true,
        data: contract
    })
}

const getAllContracts = async (req, res) => {
    const { id, type } = req.profile
    const { Contract } = req.app.get('models')

    let contracts = []
    if (type == "client")
        contracts = await Contract.findAll({ where: { ClientId: id, status: { [Sequelize.Op.not]: 'terminated' } } })
    else
        contracts = await Contract.findAll({ where: { ContractorId: id, status: { [Sequelize.Op.not]: 'terminated' } } })

    res.status(200).send({
        result: true,
        data: contracts
    })
}

const getUnpaidJobs = async (req, res) => {
    const { id, type } = req.profile

    let jobs = []
    let query = `select t1.* from Contracts as t0
                    join Jobs as t1 on t0.id = t1.ContractId and t1.paid is null
                    where ${type == "client" ? "ClientId" : "ContractorId"} = ${id}`
    try {
        jobs = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    } catch (e) {
        console.log(e)
    }

    if (!jobs.length)
        return res.status(404).send({
            message: "error"
        })

    res.status(200).send({
        result: true,
        data: jobs
    })
}

const setJobPay = async (req, res) => {
    const { id, type } = req.profile
    const { job_id } = req.params

    if (type != "client")
        return res.status(401).send({
            message: "Not Client!"
        })

    let query = `select (t2.balance-t1.price) as diffPrice, t1.price, t0.ContractorId from Contracts as t0
                    join Jobs as t1 on t0.id = t1.ContractId and t1.id = ${job_id} and t1.paid is null
                    join Profiles as t2 on t0.ClientId = t2.id`
    let result = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    console.log(result)
    if (result[0].diffPrice >= 0) {
        updateQuery = `update Profiles set balance = balance-${result[0].price} where id = ${id}`
        await sequelize.query(updateQuery, { type: sequelize.QueryTypes.SELECT })

        updateQuery = `update Profiles set balance = balance+${result[0].price} where id = ${result[0].ContractorId}`
        await sequelize.query(updateQuery, { type: sequelize.QueryTypes.SELECT })

        return res.status(200).send({
            message: "success"
        })
    } else {
        return res.status(401).send({
            message: "Not enough balance."
        })
    }
}

const setDeposit = async (req, res) => {
    const { userId } = req.params
    const { Contract, Job, Profile } = req.app.get('models')
    const { amount } = req.body

    const { balance, type } = await Profile.findOne({ where: { id: userId } })

    if (type != "client")
        return res.status(401).send({
            message: "Not Client!"
        })


    const data = await Job.findAll({
        attributes: [[Sequelize.fn('sum', Sequelize.col('price')), 'sumPrice']],
        include: {
            model: Contract,
            where: {
                ClientId: userId
            }
        },
        where: {
            paid: null
        }
    })

    let sumPrice = JSON.parse(JSON.stringify(data))[0].sumPrice
    if ((sumPrice * 0.25) > (balance + amount)) {
        await Profile.update({ balance: (balance + amount) }, { where: { id: userId } })
        return res.status(200).send({
            message: "success"
        })
    } else {
        return res.status(401).send({
            message: "error"
        })
    }
}

const getBestProfession = async (req, res) => {
    let startDate = req.query.start
    let endDate = req.query.end

    if (!startDate || !endDate) {
        return res.status(401).send({
            message: 'This field is required'
        })
    }

    let query = `select *from 
                            (select t0.*, sum(t1.price) as sumPrice from Contracts as t0
                                join Jobs as t1 on t0.id = t1.ContractId
                                where t1.paymentDate between '${startDate}' and '${endDate}' and t1.paid = 1
                                group by t0.id) as t0
                            order by t0.sumPrice desc limit 1`
    let data = []
    try {
        data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    } catch (e) {
        console.log(e)
    }

    if (!data.length) {
        return res.status(401).send({
            message: 'error'
        })
    }

    return res.status(200).send({
        result: true,
        data: data
    })
}

const getBestClients = async (req, res) => {
    let startDate = req.query.start
    let endDate = req.query.end
    let limit = req.query.limit

    if (!startDate || !endDate || !limit) {
        return res.status(401).send({
            message: 'This field is required'
        })
    }

    let query = `select t1.*, t0.sumPrice from 
                    (select t0.ClientId, sum(t1.price) as sumPrice from Contracts as t0 
                        join Jobs as t1 on t0.id = t1.ContractId and t1.paid = 1 
                        where t1.paymentDate between '${startDate}' and '${endDate}' and t1.paid = 1 group by t0.ClientId) as t0 
                    join Profiles as t1 on t0.ClientId = t1.id    
                order by sumprice desc limit ${limit}`
    let data = []
    try {
        data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    } catch (e) {
        console.log(e)
    }

    if (!data.length) {
        return res.status(401).send({
            message: 'error'
        })
    }

    return res.status(200).send({
        result: true,
        data: data
    })
}

module.exports = { getContract, getAllContracts, getUnpaidJobs, setJobPay, setDeposit, getBestProfession, getBestClients }