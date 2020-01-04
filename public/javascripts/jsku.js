const btn 	= document.getElementById("buka")
const btnKirim = document.getElementById("btnKirim")

const opsi 	= { 
				headers: {
			      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
			    },
				mode: 'cors',

			}

const txtEditor = document.getElementById('pesan')
let quill = null

/*
 mengubah quill.getContent (text dengan format) ke bentuk string/url
 @params : object => [attributes, insert]
 return char
*/
function ubahstyle(style){
	switch(style){
		case 'bold':
			return '*'
			break
		case 'italic':
			return '_'
			break
		case 'strikethrough':
			return '~'
			break
		default:
			return ''
	}
}

function ubahEmo(pesan){
	if (pesan.length <= 0) return
	const kata = []
	const format = ''
	pesan.forEach( (r, i) => {
		
		
		if (Object.keys(r).length <= 1){
			kata.push(r.insert)
		}else{
			const formatx = []
			
			Object.keys(r.attributes).forEach(tipe => {
				formatx.push(ubahstyle(tipe))
			})

			const formaty = formatx.join('')
			kata.push(formaty)
			kata.push(r.insert)
			kata.push(formaty)
		}

	})
	console.log(kata)
	return kata
}
// Quill 
if(typeof(txtEditor) !=  'undefined' && txtEditor != null){	
	const toolbarOptions = {
					  container: [
					    ['bold', 'italic', 'strike'],
					  ],
					  handlers: {'emoji': function() {}}
					}
	
	quill = new Quill('#pesan', {
	  // modules: { toolbar: true },
	  theme: 'snow',
	  placeholder: 'Ketik Pesan di sini...',
	  modules: {
	  	toolbar: toolbarOptions,
	    "emoji-toolbar": true,
	    // "emoji-textarea": true,
	    "emoji-shortname": true,
	  }

	});

}

// Connect to Web WhatsApp
if(typeof(btn) !=  'undefined' && btn != null){	
	btn.addEventListener('click', async e => {
		e.preventDefault()

		// const status = await fetch('/robot/status').then(e => e.json()).then(d => {
		// 	console.log(d);
		// })
		// return
		btn.innerHTML 	= "Menghubungkan..."

		const cek = await fetch('/robot')
		const jsonx = await cek.json()

		console.log(cek)
		if(cek.status == 200){
			// Success
			btn.innerHTML 	= 'Is Active'
			btn.classList 	= "btn btn-sm btn-success"

			console.log(jsonx)
			return
		}
		console.error('Gagal')
	})
}

// Tombol Kirim Pesan
if(typeof(btnKirim) !=  'undefined' && btnKirim != null){	
	btnKirim.addEventListener('click', async e => {
		console.log("mulai proses pengiriman")
		console.log(quill.container.innerHTML)

		e.preventDefault()
		// const pesan = document.getElementById("pesan").value
		const pesanx = quill.getContents().ops[0].insert
		const pesan = quill.getContents()

		console.log('-------- ini pesan biasa --------')
		console.log(pesan)
		console.log('-------- ini dari fungsi --------')

		const pesanku = ubahEmo(pesan)
		console.log('-------- seteleh di konvert --------')
		console.log(pesanku.join(''))
	
		const pilihkategori = document.getElementById("kategori").value

		console.log("====== Kategori ======", pilihkategori);
		let  data = await fetch('/penerima/api')
		if(pilihkategori !== ''){
			data 	= await fetch(`/penerima/api/${pilihkategori}`)
		}
		const jsonx = await data.json()
		const penerima = jsonx.data

		// return penerima

		en = pesanku.join('')

		const datapesan 	= new FormData();
		datapesan.append('pesan', en)

		elepenerima = document.getElementById('penerima')

		console.log(jsonx);
		// return

		// return


		for (var i = penerima.length - 1; i >= 0; i--) {
			opsikirim 		= {
				method 		: "POST",
				body 		: datapesan
			}
			console.log("looping ke", i)

			opsikirim.body.set('nomor', penerima[i].nomor)
			// await fetch(`/robot/estimasi/${penerima[i].nomor}/${enkrips}`).then(e => {
			await fetch(`/robot/estimasi`, opsikirim).then(e => {
				console.log(e)
			})
			var li = document.createElement('li')
			li.setAttribute('class', 'list-group-item')

			li.appendChild(document.createTextNode(penerima[i].nomor))
			elepenerima.appendChild(li)
			console.log(`looping ke ${i} sudah selesai dijalankan`)	
		}


	})
}

// Pilih Kategori
const kategori = document.getElementById("kategori")
if(typeof(kategori) !=  'undefined' && kategori != null){	
	// click
	kategori.addEventListener('click', async e => {
		if(kategori.options.length > 1) return
		// console.log(kategori.options.length)
		fetch('/penerima/kategori')
			.then(j => j.json())
			.then(k => {
				console.log(k);
				k.forEach((r, indexx) => {
					console.log(r.distinct);
					kategori.options[indexx] = new Option(r.distinct,r.distinct)
				})
			})
	})

	// change kategori
	kategori.addEventListener('change', async e => {
		console.log("ada");
	})
}



// const grab1 = document.getElementById("grab1")
// if(typeof(grab1) !=  'undefined' && grab1 != null){	
// 	grab1.addEventListener('click', async e => {
// 		e.preventDefault()

// 		fetch('/penerima/api')
// 		// .then(x => console.log(x))
// 			.then(p => p.json())
// 			.then(n => {
// 				console.log(n)
// 				penerima = document.getElementById('penerima')

// 				n.data.forEach(i => {
// 					var li = document.createElement('li')
// 					li.setAttribute('class', 'list-group-item')

// 					li.appendChild(document.createTextNode(i.nomor))
// 					penerima.appendChild(li)

// 				})
// 			})
// 			.catch(e => {
// 				console.error('Gagal', e)
// 			})
// 	})
// }

let dtku = $("#dtx").DataTable({
	"scrollY": 400,
	"processing": true,
    "serverSide": true,
    "ajax": "penerima/dtable"
})
// btnKirim 
// const btnKirim = document.getElementById("btnKirim")
// btnKirim.addEventListener('click', e => {
// 	fetch('/kirim').then(e => {
// 		console.log("terkirim");
// 	})
// })

// import excel
const formexcel = document.getElementById("formpenerima")

if(typeof(formexcel) !=  'undefined' && formexcel != null){
	formexcel.addEventListener('submit', async e => {
		e.preventDefault()
		const isi 	= new FormData();
		isi.append('filename', document.getElementById("fileexcel").files[0])
		const opsi 	= {
			method: 'POST',
			body: isi
		}
		await fetch('/penerima', opsi).then( e => {
			console.log(e)
		})
		dtku.ajax.reload()

	})
}

