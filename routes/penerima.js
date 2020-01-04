const express 	= require('express');

const router 	= express.Router();
const model 	= require('../models/index')
const importxls = require('convert-excel-to-json')
const hapus 	= require('del')

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const mysql 	= require('mysql2')
const NodeTable = require('nodetable')

const db = mysql.createConnection({
  host: "localhost",
  user: config.username,
  password: config.password,
  database: config.database
});

db.connect()
router.get('/', async (req, res, next) => {
	try{
		const data = await model.tbl_penerima.findAll({})
	  	res.render('penerima', { data: data });
	}catch(errorx){
		res.render('error', errorx.toString())
	}
})
router.get('/api', async (req, res, next) => {

	try{
		const pesan = {
			'status'	: 'OK',
			'messages'	: '',
			'data'		: {}
		}

		const data = await model.tbl_penerima.findAll({})
		
		if(data.length !== 0){
			pesan.data 	= data
			res.status(200).json(pesan)
		}else{
			pesan.status 	= 'ERROR' 
			pesan.messages 	= 'EMPTY'
			res.status(505).json(pesan)
		}
	}catch(errorx){
		pesan.status 	= 'ERRORx'
		pesan.messages	= `ada error di ${errorx.messages}`
		res.status(404).json(pesan)
	}
})

// penerima with kategori 
router.get('/api/:kategori', async (req, res) => {
	try{
		const pesan = {
			'status'	: 'OK',
			'messages'	: '',
			'data'		: {}
		}

		const data = await model.tbl_penerima.findAll({
			where: { kategori: req.params.kategori }
		})
		
		if(data.length !== 0){
			pesan.data 	= data
			res.status(200).json(pesan)
		}else{
			pesan.status 	= 'ERROR' 
			pesan.messages 	= 'EMPTY'
			res.status(505).json(pesan)
		}
	}catch(errorx){
		pesan.status 	= 'ERRORx'
		pesan.messages	= `ada error di ${errorx.messages}`
		res.status(404).json(pesan)
	}

})
router.post('/', async (req, res, next) => {
	let file = req.files.filename
	let filename = file.name
	let nomor = []
	file.mv('./public/files/' + filename, async (err) => {
		if(err){
			res.send('Gagal Upload' + err)
		}else{
			await model.tbl_penerima.destroy({
				where: {},
				truncate: true
			})
			 let result = importxls({
			 	// header: {rows: 1},
			 	columnToKey: {A: 'nama', B: 'nomor', C: 'tgl_lahir', D: 'tempat_lahir'},
			 	// sheets : ['Sheet1'],
			 	sourceFile: './public/files/' + filename
			 })

			let data = []

			Object.keys(result).forEach((s, i) => {
				const sheetx = s.replace(' ', '')
				result[sheetx].forEach( (r, i) => {
					data.push({nama: r.nama,nomor: r.nomor, kategori: sheetx})
				})

			})		
			await model.tbl_penerima.bulkCreate(data, {
				fields: ['nama','nomor','kategori']
			})	
			
		}
	})

})

router.delete('/:id', async (req, res, next) => {
	try{
		const pk = req.params.id
		const data = await model.tbl_penerima.destroy({
			where: {
				id: pk
			}
		})

		if(data){
			res.status(201).json({
				'status': 'OK',
				'messages': 'Berhasil dihapus data penerima',
				'data'	: data
			})
		}
	}catch(errorx){
		res.status(400).json({
			'status':'ERROR',
			'messages': errorx.messages,
			'data'	: {}
		})
	}
})

router.get('/dtable', async ( req, res, next ) => {

	const requestQuery = req.query;
	let kolom = [
		{
			db: "nama",
			dt: 0
		},
		{
			db: "nomor",
			dt: 1
		},
		{
			db: "kategori",
			dt: 2
		}
	]
	const tableName = "tbl_penerimas"
	const pk 		= "id"

	// const data 		= await model.tbl_penerima.findAll({})
	const nodeTable = new NodeTable(requestQuery, db, tableName, pk, kolom)

	nodeTable.output((err, data) => {
		if(err){
			return
		}
		res.send(data)
	})

})

// get all kategori 
router.get('/kategori', async ( req, res, next ) => {
	const data = await model.tbl_penerima.aggregate('kategori', 'distinct', { plain: false })
	res.json(data)
})

module.exports = router;
