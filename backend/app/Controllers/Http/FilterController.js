'use strict'

const Axios = use('Axios'); // Adonis request method
const FormData = use('form-data'); // Adonis request method
const DomParser = use('dom-parser'); // Adonis request method



class FilterController {

  async location({request, auth, response}) {
    let parseData = [];
    try{
      var parser = new DomParser();
      var formData = new FormData();
      formData.append('reg_id', 7);
      let locations = await Axios({
        method: 'post',
        headers: formData.getHeaders(),
        url: 'https://midastest.minsal.cl/farmacias/maps/index.php/utilidades/maps_obtener_comunas_por_regiones',
        data: formData
      })
      var data = parser.parseFromString(`<select id='select'>${locations.data}</select>`, 'text/html');

      parseData = data.getElementById('select').childNodes
        .map(o => ({
          name: o.textContent,
          value: o.getAttribute('value')
        }));
      return response.json(parseData)
    }
    catch (e) {
      return response.status(503).json({message: e.message, stack: e.stack})
    }
  }

  async subsidiary({request, auth, response}) {
    try {
      let subsidiaries = await Axios({
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        url: `https://farmanet.minsal.cl/maps/index.php/ws/getLocalesRegion?id_region=7`,
      })

      if( request.input('location') ){
        subsidiaries.data = subsidiaries.data.filter(o => o.fk_comuna === request.input('location')  )
      }

      if( request.input('name') ){
        subsidiaries.data = subsidiaries.data.filter(o => o.local_nombre.toLowerCase() === request.input('name').toLowerCase()  )
      }

      if( request.input('address') ){
        subsidiaries.data = subsidiaries.data.filter(o => o.local_direccion.toLowerCase() === request.input('address').toLowerCase()  )
      }

      if( request.input('phone') ){
        subsidiaries.data = subsidiaries.data.filter(o => o.local_telefono.toLowerCase() === request.input('phone').toLowerCase()  )
      }

      if( request.input('lat') ){
        subsidiaries.data = subsidiaries.data.filter(o => o.local_lat === request.input('lat')  )
      }

      if( request.input('lng') ){
        subsidiaries.data = subsidiaries.data.filter(o => o.local_lng === request.input('lng')  )
      }

      //console.log('subsidiaries', subsidiaries.data)
      return response.json(subsidiaries.data)
    }
    catch (e) {
      return response.status(503).json({message: e.message, stack: e.stack})
    }
  }

}

module.exports = FilterController
