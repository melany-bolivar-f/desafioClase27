const productDaoMongo = require('../daos/mongo/productDaoMongo')
const userDaoMongo = require('../daos/mongo/userDaoMongo')


class ViewsController {
    constructor(){
        this.productViewService = new productDaoMongo()
        this.userViewService = new userDaoMongo()
    }

    home = async (req, res) => {
        try{
            const { limit, pageNumber, sort, query } = req.query
            const parsedLimit = limit ? parseInt(limit, 10) : 10
            const userId = req.session && req.session.user ? req.session.user.user : null
            const user = await this.userViewService.getUserBy({ _id: userId })
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await this.productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
            //console.log(docs)
            res.render('home', {
                title: 'Home',
                user,
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            })
        }catch(err){
            console.log(err)
            res.status(500).send({message:'Server error'})
        }
    }

    realTimeProducts = async (req, res) => {
        try{
            const { limit, pageNumber, sort, query } = req.query
            const parsedLimit = limit ? parseInt(limit, 10) : 10
            const userId = req.session && req.session.user ? req.session.user.user : null
            const user = await this.userViewService.getUserBy({ _id: userId })
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await this.productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
            //console.log(docs)
            res.render('realTimeProducts', {
                title: 'Real Time',
                user,
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            })
        }catch(err){
            console.log(err)
            res.status(500).send({message:'Server error'})
        }
    }

    chat = async (req,res) => {
        const userId = req.session && req.session.user ? req.session.user.user : null
        const user = await this.userViewService.getUserBy({ _id: userId })
        try{
            res.render('chat', {
            title: "Chat",
            user,
            })
        }catch(err){
            console.log(err)
            res.status(500).send({message:'Server error'})
        }
    }

    products = async (req,res) =>{
        try{
            const { limit, pageNumber, sort, query } = req.query
            const parsedLimit = limit ? parseInt(limit, 10) : 10
            const userId = req.session && req.session.user ? req.session.user.user : null
            console.log(userId)
            const user = await this.userViewService.getUserBy({ _id: userId })
            console.log('User data:', user)
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await this.productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
            //console.log(docs)
            res.render('productsView', {
                title: 'Products View',
                user,
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            })
        }catch(err){
            console.log(err)
            res.status(500).send({message:'Server error'})
        }
    }

    productsDetails = async (req,res) =>{
        try{
            const pid = req.params.pid;
            const filteredProduct = await this.productViewService.getProductById(pid)
            if(filteredProduct){
                res.render('details', {
                    title: 'Detalle del producto',
                    filteredProduct
                })
            }
            else{
                res.status(404).send("El producto no existe")
            }
        }catch(error){
            console.log(error)
            res.status(500).send('Server error')
        }
    }

    login = async (req,res) =>{
        res.render('login')
    }

    register = async (req,res) =>{
        res.render('register')
    }

}

module.exports = ViewsController