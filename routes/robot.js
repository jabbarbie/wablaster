var express = require('express');
var router = express.Router();

// selenium
const webdriver = require('selenium-webdriver')
const chrome 	= require('selenium-webdriver/chrome')
const chromedriver = require('chromedriver')

// variable berjalan
// menerima post


const daftarwindow = []

let copsiku 		= new chrome.Options()
copsiku.windowSize({width: 700, height: 700})
copsiku.addArguments('user-data-dir=./satekambing')

let nani = '' 
// pertama akses driver ke fungsi driverx, selanjutnya ke nani

const bahasa = {
      CHAT_INPUT : "//div[@class='_3u328 copyable-text selectable-text']"
}

function driverx(){
	return driver 	= new webdriver.Builder()
						.setChromeOptions(copsiku)
						.withCapabilities(webdriver.Capabilities.chrome())
						.build()
}
function fokusKeWindow(driver, ke){
	driver.switchTo().window(daftarwindow[ke])
}
function showAllHandle(driverx){
	console.log("Menampilkan Semua Window")
	driver.getAllWindowHandles().then( e => {
		console.log(e)
	})
}

async function kirim(opsi){


		return new Promise(async (response, reject) => {
			let {
				nomor,
				pesan
			} = opsi

			// pesan = "Hi%2C%0D%0A­Saya+Jabbar"
			const driver 	= nani

			console.log(driver.getWindowHandle());


			console.log(`############### ${nomor} ###############`)
			// return
			await showAllHandle(driver)
			// await driver.switchTo().window(daftarwindow[0])
			console.log("daftarwindow", daftarwindow)
			// await fokusKeWindow(driver, 0)
			// if(driver === '') return
			// await driver.navigate().to('http://google.co.id')
			// const google = await driver.wait(webdriver.until.elementLocated(webdriver.By.name('q'))); 
			

			// ini work ke google
			// await driver.navigate().to('http://google.co.id')
			// const google = await driver.wait(webdriver.until.elementLocated(webdriver.By.name('q'))); 
			// await google.sendKeys(nomor)
			// await google.sendKeys(webdriver.Key.RETURN)

			console.log(`mengakses web whatsapp ${nomor} ${pesan}`)
			try{
				// await driver.navigate().to(`http://web.whatsapp.com/send?phone=${nomor}&text=${pesan}`)
				await driver.navigate().to(`http://web.whatsapp.com/send?phone=${nomor}&text=${pesan}`)
			}catch(e){
				console.log("gagal");
			}
			console.log("mengambil handle");
			const idwindow = await driver.getWindowHandle()
			console.log("id window saat ini", idwindow)
			// await google.sendKeys(nomor)

			console.log('mulai mengirim')			
			const google = await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath(bahasa.CHAT_INPUT))); 
			if(nomor == '6282228508454'){
				// await driver.switchTo().alert().getText();
			}
			console.log('mulai mengetik')
			// await google.sendKeys(pesan)			
			await google.sendKeys(webdriver.Key.RETURN)

			driver.sleep(5000)
			await google.sendKeys(webdriver.Key.RETURN)


			//await driver.navigate().refresh()
			await driver.switchTo().newWindow('tab')
			await driver.close()

			await driver.switchTo().window(idwindow)
			// console.log(driver.getWindowHandle())
			// await driver.navigate().to(`http://www.google.com`)
			await showAllHandle(driver)

			const log = await driver.manage().logs()

			console.log(log)
			response(nomor)

			console.log('done!')


		}).then(n => {
			return(n)
		}).catch(e => {
			console.log(e.getMessages())
		})
		

		// console.log(opsi.pesan)	

		
}
/* GET home page. */
router.get('/', async function(req, res, next) {
	try{
		const driver = driverx()
		await driver.get('http://web.whatsapp.com')
	  
	  	console.log(driver.getTitle())

	  	const id 	= await driver.getWindowHandle()

	  	daftarwindow.push(id)
	  	console.log(id)
	  	nani = driver
	  	res.status(200).json({
	  		'status': 'Ok',
	  		'messages': '',
	  		'data'	: {
	  			id_session: id
	  		}
	  	})
	}catch(errorx){
		res.status(500).json({
	  		'status': 'Error',
	  		'messages': 'Gagal Bosque',
	  		'data'	: {}
	  	})
	}
	
  // res.render('index', { title: 'Express' });
});

router.get('/status', async (req, res) => {
	const driver 	= nani
	const windowx 	= await driver.getWindowHandle()
	
	const data = {
		window: windowx
	}
	res.json(data)
})
// Kirim Pesan
router.get('/kirim/:nomor/:pesan', async (req, res, next) => {
	try{
		const driver 	= nani
		// if(driver === '') res.send('Gagal')

		console.log(driver.getWindowHandle());

		return
		const opsi = {
			pesan: req.params.pesan,
			nomor: req.params.nomor
		}
		console.log('Lanjut pengiriman ke nomor', opsi.nomor)
		console.log('Proses Fokus Window')

		// await fokusKeWindow(driver, 0)

		console.log('Proses Pengiriman')
		const statuskirim = await kirim(opsi)
		console.log('Pengiriman sudah selesai')

		if(statuskirim == 1){
			console.log('status berhasil')
			res.status(200).json({
				status 	: 'Ok',
				messages : 'Pengiriman berhasil',
				data 	: {
					nomor: opsi.nomor
				}  
			})
		}else{
			console.log('status gagal')
			res.status(200).json({
				status 	: 'Gagal',
				messages : 'Pengiriman gagal',
				data 	: {
					nomor: opsi.nomor
				}  
			})
		}
		// console.log("mulai menjalankan fungsi fokusKeWindow");

		// console.log("mulai membuka google");
		// await driver.navigate().to('http://google.co.id')

		// console.log("mulai mencari elementLocated");
		// const google = await driver.wait(webdriver.until.elementLocated(webdriver.By.name('q'))); 
		// await google.sendKeys(String(req.params.pesan))
		// await google.sendKeys(webdriver.Key.RETURN)
	}catch(errorx){
		console.error('Proses Pengiriman Gagal')
	}
})
router.post('/estimasi', async (req, res, next) => {

	let pesan = req.body.pesan

	pesan 	= encodeURI(pesan)
	console.log("---------- pesan robot -----------")
	console.log(pesan)

	const opsi = {
		nomor: req.body.nomor,
		pesan: pesan
	} 

	console.log("---- isi Pesan ----")
	console.log(req.body)
	await kirim(opsi)
			.then(r => {
				if(r == opsi.nomor){
					res.status(200)
					res.send('OK')
				}
			}).catch(e => {
				console.log("error", e)
			})
	// ini work
	// const angka = ['fauzi','jabbar','faisal']
	// await new Promise((res, rej) => {
	// 	setTimeout((e) => {
	// 		res(req.params.pesan)
	// 	}, 5000)
	// }).then(e => {
	// 	res.send(angka[e])
	// })



	// fetch(`/kirim?nomor=${nomor}&pesan=${enkrip}`)

	// fetch('/penerima/api')
	// 	.then(j => j.json())
	// 	.then(async d => {
	// 		const listnomor = d.data

	// 		// d.data.forEach(async i => {
	// 		// 	await fetch(`/robot/kirim/${i.nomor}/${enkrip}/`)
	// 		// 	console.log(`Proses pengiriman ke-${i.nomor}`)				
	// 		// })

	// const listnomor = [
	// 	{nama: 'jabbarbie', nomor: '099999'},
	// 	{nama: 'fauzi', nomor: '0777'},
	// ]

	// listnomor.forEach( nomor => {
	// 	console.log('Fungsi dijalankan')
	// 	setTimeout(() => {
	// 		console.log('sate kambing')
	// 	}, 30000)
	// })

	// await Promise.all(listnomor.map(async (x) => {
	// 	console.log('Isi variable', x)

	// 	const opsi = {
	// 		pesan: req.params.pesan,
	// 		nomor: x.nomor
	// 	}
	// 	const tunggu = await kirim(opsi)
		
	// }))

	// const data 	= await fetch('/penerima/api')
	// const nomor = await data.json()

	// res.json(nomor) 
})

/*
*/


module.exports = router;
