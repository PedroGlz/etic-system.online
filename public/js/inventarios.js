/* Variables */
var TreeView;
var datos_treeview = [{"text":"Sin ubicaciones","state": {"disabled":true}}];
var JsGridInventario;
var JsGridProblemas;
var JsGridHistorialProblemas;
var JsGridHistorialInspecciones;
var JsGridBaseLine;
var JsGridListaBaseLine;
var datos_treeview_iniciales = [];
var nodosTreeView = [];
var procesoValidacionFormInventarios;
var procesoValidacionFormProblemas;
var procesoValidacionBaseLine;
var procesoValidacionResultadosAnalisis;
var procesoValidacionFechasExcelProblemas;
var primerCargaTreview = true;
var StrTipoInspeccion;
var idSitio;
var idInspeccion;
var idInspeccion_Det;
var idUbicacion = '';
var StrEquipo;
var StrRuta;
var nodoSeleccionado = {estatus:false , esEquipo: false, Id_Ubicacion_padre:0, Nivel_arbol:1, ruta: ''};
var valoresDefaulProblema;
var dataGridProblemas;
var datos_treeview = [];
var arrayUbicacionesFiltro = [];
var dataSelectFallas = [];
var inputImgStr = "";
var elementosSeleccionadosTree = [];
var elementosSeleccionadosJsGrid = [];
var rowJsGridInventario = "";
var contenedorImgSeleccionado = "";
var datosImPdf;
var dataFilasJsGridBaseLine = "";
var dataFilasJsGridProblemas = 0;
var totalFilasJsGridBaseLine = "";
var filaActualJsGridBaseLine = "";
var filaActualJsGridProblemas = "";
var totalFIlasBaseLine = 0;
var totalFIlasProblemas = 0;
var arrayIdElementos = [];
var arrayContactosSitio = [];
var arrayUbicacionesOrdenadas = [];
var nombre_archivo_inspeccion = "";
var datos_base_line_filtro = [];


window.addEventListener('DOMContentLoaded', (event) => {

  // Valor que se toma de la vista menu
  let tipo_usuario = document.querySelector('#tipo_usuario_log').value;
  let ctrl_estatus_inspeccion = document.querySelector('#ctrl_estatus_inspeccion').value
  /* Variable bandera para identificar si habilitamos el modulo o no dependiendo de la validacion de que si hay una inpección activa */
  let iniciar_moduulo = false;
  
  // Validacion si existe inspección abierta
  if(Id_Inspeccion.value == ''){
    
    iniciar_moduulo = false;

    if (tipo_usuario == "Administradores") {

      Swal.fire({
        // title: 'Error!',
        title: '¡Debe seleccionar una inspección!',
        icon: 'warning',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Cargar inspección',
        showCancelButton: true,
        cancelButtonColor: '#1279B4',
        cancelButtonText: 'Seleccionar inspección',
      }).then((result) => {
        if (result.isConfirmed) {
          $('#modal_inportar_bd_inspeccion').modal('show');
        }else{
          window.location = "/inspecciones";
        }
      })

    }else if(tipo_usuario == "Termografos") {

      Swal.fire({
        // title: 'Error!',
        title: 'Cargar inspección',
        text: 'No hay una inspección seleccionada',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Cargar inspeccion',
      }).then((result) => {
        if (result.isConfirmed) {
          $('#modal_inportar_bd_inspeccion').modal('show');
        }
      })

    }

  }else{
    
    iniciar_moduulo = true;
    
    // Si hay estatus de inspeccion y es diferente a cerrado entonces abilitamos el modulo
    if (ctrl_estatus_inspeccion != 0 && ctrl_estatus_inspeccion != "73F27007-76B3-11D3-82BF-00104BC75DC2") {
      document.querySelector("#contenedor_modulo_inspeccion_actual").classList.remove("disable");
      document.querySelector("#select_actualizar_estatus_inspeccion").value = ctrl_estatus_inspeccion;
    }
    // Mostramos alerta en lo que se carga el treeview
    alertLodading();
  }

  /* Variables elementos DOM */
  idSitio = document.querySelector('#Id_Sitio').value;
  idInspeccion = document.querySelector('#Id_Inspeccion').value;
  const btnInicio = document.querySelector('#btnInicio');
  const selectEstatus = document.querySelector('#Id_Status_Inspeccion_Det');
  const btn_nueva_ubicacion = document.querySelector('#btn_nueva_ubicacion');
  const btnGuardarUbicacion = document.querySelector('#btnGuardarUbicacion');
  const sitioRuta = document.querySelector('#pathUbicacion').textContent;
  const btnNuevoProblema = document.querySelector('#btnNuevoProblema');
  const btnProblemaContinuar = document.querySelector('#btnProblemaContinuar');
  const btnGuardarProblema = document.querySelector('#btnGuardarProblema');
  const selectFallaProblema = document.querySelector('#Id_Falla');
  const selectProblemPhase = document.querySelector('#Problem_Phase');
  const selectVisualGroup = document.querySelector('#hazard_Group');
  const selectVisualProblema = document.querySelector('#hazard_Issue');
  const filtroTipoProblem = document.querySelector('#filtroTipoProblem');
  const filtroEstatus = document.querySelector('#filtroEstatus');
  const btnCronico = document.querySelector('#btnCronico');
  const contenedorImgProblemaVisual = document.querySelector('#contenedorImgProblemaVisual');
  const contenedorImgIrBl = document.querySelector('#contenedorImgIrBl');
  const contenedorImgDigBl = document.querySelector('#contenedorImgDigBl');
  const contenedorImgIrProblemas = document.querySelector('#contenedorImgIrProblemas');
  const contenedorImgDigProblemas = document.querySelector('#contenedorImgDigProblemas');
  const contenedorImg_portada_word = document.querySelector('#contenedorImg_portada_word');
  const btnGuardarBaseLine = document.querySelector('#btnGuardarBaseLine');
  const btnSubirImg = document.querySelector("#btnSubirImg");
  const btnLimpiarMultiFile = document.querySelector("#btnLimpiarMultiFile");
  const btnEliminarImg = document.querySelector("#btnEliminarImg");
  const btnSeleccionarImg = document.querySelector("#btnSeleccionarImg");
  const divJsGridInventario = document.querySelector('#jsGridInventario');
  const btnReporteInventarios = document.querySelector('#btnReporteInventarios');
  const btnReporteProblemas = document.querySelector('#btnReporteProblemas');
  const contenedorBtnNavegacionBL = document.querySelector('#contenedorBtnNavegacionBL');
  const contenedorBtnNavegacionProblemas = document.querySelector('#contenedorBtnNavegacionProblemas');
  const btnGenerarPdf_inventario = document.querySelector('#btnGenerarPdf_inventario');
  const btnGenerarPdfproblemas = document.querySelector('#btnGenerarPdfproblemas');
  const btnReporteProblemasAbiertos = document.querySelector('#btnReporteProblemasAbiertos');
  const btnReporteProblemasCerrados = document.querySelector('#btnReporteProblemasCerrados');
  const btnGenerarResultadoAnalisis = document.querySelector('#btnGenerarResultadoAnalisis');
  const btnGenerarReporteAnalisis = document.querySelector('#btnGenerarReporteAnalisis');
  const btnReporteBaseLine = document.querySelector('#btnReporteBaseLine');
  const btnGraficaConcentradoProblemas = document.querySelector("#btnGraficaConcentradoProblemas");
  const btnReporteListaProblemasExcel = document.querySelector('#btnReporteListaProblemasExcel');
  const btn_generar_reporte_excel_problemas = document.querySelector('#btn_generar_reporte_excel_problemas');
  
  // Si pasa la validación de una inspeccion activa se inician todas las funciones
  if (iniciar_moduulo) {
    // Creamos el select de estatus
    colocar_datos_reporte();
    cargarDataJsGridBaseLine();
    cargarDataSelectFallas();
    explorarArchivos();
    crearSelectStatusInspeccionDetalle('Id_Status_Inspeccion_Det');
    crearSelectStatusInspeccionDetalle('Test_Estatus');
    crearSelectTipoPrioridades('Id_Tipo_Prioridad');
    crearSelectFabricantes('Id_Fabricante');
    crearSelectFabricantes('idFabricanteProblemas');
    crearSelectFases('Problem_Phase');
    crearSelectFases('Reference_Phase');
    crearSelectFases('Additional_Info');
    crearSelectTipoAmbientes('Environment');
    // Cargar contactos en el modal para el reporte word
    cargarContactos();
    // Creamos el trebiew con datos por default
    crear_treeview(datos_treeview);
    // Cargamos el jsGrid
    cargarJsGridProblemas();
    cargarDataJsGridProblemas();
    // Cargamos el jsGrid
    cargarJsGridInventarios();
    // Creando el jsgrid de historial de problemas
    cargarJsGridHistorialProblemas();
    cargarJsGridHistorialInspecciones();
    cargarJsGridBaseLine()
    cargarJsGridListaBaseLine()
    // Obtenemos los datos para el treeview y se crea de nuevo el elemento
    cargar_datos_treeview().then(() => {
      iniciarElementos();
      cargarEventListeners();
      cerrarAlertLoading();
    });
    validarFrmInventario();
    validarFrmProblemas();
    validarFormBaseLine();
    validarFormInfoReporteResultadoAnalisis();
    validarFrmFechasExcelProblemas();
  }

  /* Listeners */
  function cargarEventListeners(){
    // Se activa cuando se hace clic en el boton Inicio
    btnInicio.addEventListener('click', iniciarElementos);
    selectEstatus.addEventListener('change', limpiarChecksEstatus);
    btn_nueva_ubicacion.addEventListener('click', nuevoRegistro);
    btnGuardarUbicacion.addEventListener('click', guardarDatos);
    $('#modalBaseLine').on('hide.bs.modal', limpiarFrmBaseLine);
    $('#modalAgregarUbicacion').on('hide.bs.modal', limpiar_frm_ubicaciones_baseline);
    $('#modalProblemas').on('hide.bs.modal', limpiarFrmProblemas);
    // $('#modalInfoReporteResultadoAnalisis').on('hide.bs.modal', limpiarFrmResultadoAnalisis);
    $('#modal_fechas_reporte_excel_problemas').on('hide.bs.modal', limpiarFrmFechasExcelProblemas);
    $('#modalSeleccionarProblema').on('hide.bs.modal', () => {
      $('#frmSeleccionarProblema')[0].reset();
    });
    btnNuevoProblema.addEventListener('click', nuevoProblema);
    btnProblemaContinuar.addEventListener('click', cambiarMdl);
    btnGuardarProblema.addEventListener('click', guardarDatosProblema);
    $(".crearComentAuto").change((event) => {
      crearComentario(event)
    });
    filtroTipoProblem.addEventListener('change', filtrarProblemas);
    filtroEstatus.addEventListener('change', filtrarProblemas);
    btnCronico.addEventListener('click', problemaCronico);
    // contenedorImgProblemaVisual.addEventListener('click', (event) => {
    //   document.querySelector("#preview_Photo_File_Visual").src = `public/Archivos_ETIC/inspecciones/${strNumInspeccion.value}/Imagenes/${Photo_File_Visual.value}`
    // });
    contenedorImgIrBl.addEventListener('click', (event) => {
      // document.querySelector("#imgIR_BL").src = `public/Archivos_ETIC/inspecciones/${strNumInspeccion.value}/Imagenes/${Archivo_IR.value}`
      datosImg(document.querySelector("#imgIR_BL"),Archivo_IR.value)
    });
    contenedorImgDigBl.addEventListener('click', (event) => {
      // document.querySelector("#imgID_BL").src = `public/Archivos_ETIC/inspecciones/${strNumInspeccion.value}/Imagenes/${Archivo_ID.value}`
      datosImg(document.querySelector("#imgID_BL"),Archivo_ID.value)
    });
    contenedorImgIrProblemas.addEventListener('click', (event) => {
      // document.querySelector("#imgIR_Problema").src = `public/Archivos_ETIC/inspecciones/${strNumInspeccion.value}/Imagenes/${Ir_File.value}`
      datosImg(document.querySelector("#imgIR_Problema"),Ir_File.value)
    });
    contenedorImgDigProblemas.addEventListener('click', (event) => {
      // document.querySelector("#imgID_Problema").src = `public/Archivos_ETIC/inspecciones/${strNumInspeccion.value}/Imagenes/${Photo_File.value}`
      datosImg(document.querySelector("#imgID_Problema"),Photo_File.value)
    });

    contenedorImg_portada_word.addEventListener('click', (event) => {
      datosImg(document.querySelector("#img_portada"),nombre_img_portada.value)
    });

    $(".inputTextImg").keypress((event) => {
      console.log(event.target.parentElement)
      console.log(contenedorImgSeleccionado)
      console.log(Archivo_ID.value)
      setTimeout(() => {
        event.target.parentElement.click();  
      }, 1250);
      
    });
    $('#modalFileExplorer').on('shown.bs.modal', function (event) {
      contenedorImgSeleccionado = event.relatedTarget.parentElement.parentElement;
    })
    btnGuardarBaseLine.addEventListener('click', guardarDatosBaseLine);
    $(".btnGetLastImg").click((event) => {lastImg(event)});
    $(".btnUp,.btnDown").click((event) => {calcularImg(event)});
    btnSubirImg.addEventListener('click', guardarArchivosIMG);
    btnLimpiarMultiFile.addEventListener('click', () => {document.querySelector("#imagenes").value = "";});
    btnEliminarImg.addEventListener('click', eliminarImg);
    btnSeleccionarImg.addEventListener('click', seleccionarImagen);
    $(".btnModalArchivos").click((event) => {ubicarTextImg(event)});
    $('#modalFileExplorer').on('hide.bs.modal', limpiarCheckBoxImg);
    divJsGridInventario.addEventListener('click', (event) => {checkedJsGrid(event)});
    btnReporteInventarios.addEventListener('click', (event) => {seleccionarElementosReporte("contenedor_lista_ri",1)});
    btnReporteProblemas.addEventListener('click', (event) => {seleccionarProblemasReporte("tablaProblemasPdf_ri",1)});
    contenedorBtnNavegacionBL.addEventListener('click', (event) => {navegacionListaBaseLine(event)});
    contenedorBtnNavegacionProblemas.addEventListener('click', (event) => {navegacionListaProblemas(event)});
    btnGenerarPdf_inventario.addEventListener('click', () => {obtenerDatosReporteInventariosPdf("individual")});
    btnGenerarPdfproblemas.addEventListener('click', () => {obtenerDatosReporteProblemasPdf("individual")});
    $(".btnCheckAll").click((event) => {check(event)});
    btnReporteProblemasAbiertos.addEventListener('click', () => {reporteListaProblemas("Abierto","individual")});
    btnReporteProblemasCerrados.addEventListener('click', () => {reporteListaProblemas("Cerrado","individual")});
    btnGenerarResultadoAnalisis.addEventListener('click', infoReporteResultadoAnalisis);
    $(".btnLimpiarContacto").click("click", (event) => {limpiarCampoContacto(event)})
    $("#FrmInfoReporteResultadoAnalisis").click("click", (event) => {camposReporeteResultados(event)})
    btnGenerarReporteAnalisis.addEventListener('click', generarReporteResultadoAnalisis);
    btnReporteBaseLine.addEventListener('click', () => {generarReporteBaseLine("individual")});
    btnGraficaConcentradoProblemas.addEventListener('click', () => {generarGraficaConcentradoProblemas("individual")});
    btnReporteListaProblemasExcel.addEventListener('click', seleccionarFechasReporteExcelProblemas);
    btn_generar_reporte_excel_problemas.addEventListener('click', generarReporteListaProblemasExcel);
  }

  /* Funciones */

  // Creamos el treeView
  function crear_treeview(datos_treeview){
    TreeView = $('#treeview').treeview({
      expandIcon: 'fas fa-plus', /* icono para expandir */
      collapseIcon: 'fas fa-minus', /* icono para colapsar */
      checkedIcon: 'fas fa-pen-square', /* icono para checkeado */
      uncheckedIcon: 'far fa-square', /* icono para no checkeado */
      showCheckbox: false, /* mostrar icono check */
      levels: 1, /* Elementos collapsados al nivel 1 */
      data: datos_treeview,
    });

    /* Eventos del treeView */
    TreeView.on('nodeSelected', function(event, node) {
      console.log(event)
      // Limpiamos el array para agregar nuevos id para filtrar
      arrayUbicacionesFiltro = []
      console.log(node)
      // console.log(arrayUbicacionesFiltro)
      nodoSeleccionado.estatus = true;
      nodoSeleccionado.esEquipo = node.Es_Equipo == 'SI' ? true : false ;
      nodoSeleccionado.Nivel_arbol = parseInt(node.level) + 1;
      nodoSeleccionado.Id_Ubicacion_padre = node.id;
      nodoSeleccionado.ruta = node.path;
      nodoSeleccionado.nodeId = node.nodeId;

      // Op ternario para guardar los nodos de los items en nodosTreeView y enviarlos al jsGrid,
      // si no tiene nodos la variable nodosTreeView se va como un arreglo vacio para mostrar mensaje de lista vacia
      node.nodes == null ? nodosTreeView = [] : nodosTreeView = node.nodes;
      JsGridInventario.jsGrid("loadData",{ data : nodosTreeView});

      // Agregamos el id del elemento actual
      arrayUbicacionesFiltro.push(node.id);
      // Posteriormente agregamos los id de sus nodos
      obtenerIdsFiltro(nodosTreeView);

      // Asignacion de valores para el alta de una ubicación
      document.querySelector('#Nivel_arbol').value = parseInt(node.level) + 1;
      document.querySelector("#Id_Ubicacion_padre").value = node.id;

      // Asignacion de valores para el alta de un problema
      idInspeccion_Det = node.Id_Inspeccion_Det;
      idUbicacion = node.id;
      StrEquipo = node.nameUbicacion;
      StrRuta = sitioRuta.concat(node.path);
      /* En este imput se guarda el nombre de la ruta del elemento actual seleccionado para enviarle
      al back y concatenarse con el nombre de la nueva ubicacion a agregar y así se arme la ruta */
      document.querySelector("#ruta_nueva_ubicacion").value = node.path;
      colocarRuta('pathUbicacion',node.path);
      
      // Filtrar problemas y baseline por cada elemento
      filtrarProblemas();
    });

    TreeView.on('nodeUnselected ', function(event, node) {
      unselectedNodo()
      limpiar_frm_ubicaciones_baseline()
    });

  }

  function cargar_datos_treeview(){
    return new Promise((resolve, reject) => {
      datos_treeview = [{"text":"Sin ubicaciones","state": {"disabled":true}}];

      $.ajax({
        url: '/inventarios/obtenerarbol',
        data:{Id_Sitio:Id_Sitio.value,Id_Inspeccion:Id_Inspeccion.value},
        type: 'POST',
        dataType: "json",
        success: function(data){
          // console.log(dataGridProblemas)
          console.log(data)

          if (data.length > 0) {

            data.forEach(ubicacion =>{

              ubicacion.nameUbicacion= ubicacion.name,
              ubicacion.text= ubicacion.name,
              ubicacion.icon= ubicacion.Es_Equipo == 'SI' ? 'fas fa-traffic-light':'fas fa-grip-vertical tamañoIconoTree',
              ubicacion.color= ubicacion.color_text,
              ubicacion.Nivel= ubicacion.level,
              ubicacion.nodes = data.filter(nodo => nodo.Id_Ubicacion_padre == ubicacion.id)
              
              if (ubicacion.nodes == ''){
                delete ubicacion.nodes
              }

              datos_treeview = data.filter(nodo => nodo.Id_Ubicacion_padre == 0)
            });
          }

          /* Creando nuevamente el treeview con los datos */
          crear_treeview(datos_treeview)
          /* Cargar datos en el jsgrid de ubicaciones */
          datos_treeview_iniciales = datos_treeview;
          JsGridInventario.jsGrid("loadData",{ data : datos_treeview_iniciales});

          resolve(datos_treeview);
        },
        error: function (error) {
          crear_treeview(datos_treeview)
          reject(datos_treeview)
        },
      });
    })
  }

  /* Funcion que obtiene lod id de los nodos de un elemento */
  function obtenerIdsFiltro(data){
    data.forEach(element => {
      // agregamos el id al arreglo
      arrayUbicacionesFiltro.push(element.id)
        // si tiene mas nodos volvemos a entrar a la funcion para seguir obteniendo los ids
      if (element.nodes != undefined){
        obtenerIdsFiltro(element.nodes)
      }
    })
  }

  function cargarJsGridInventarios(){
    // Creacion del jsGrid
    JsGridInventario = $("#jsGridInventario").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      selecting: true,
      paging: false,
      pageSize: 15,
      autoload: false,
      filtering: false,
      noDataContent: "La lista esta vacía",
      confirmDeleting: false,

      controller: {
        loadData: function(filter){
          return filter.data
        },
        deleteItem: function(item) {
          return $.ajax({
            url: "/inventarios/borrar/"+item.id,
            dataType: 'json',
            success: function (res) {
              // creamos de nuevo el treeview actualizado
              cargar_datos_treeview().then(() => {
                ubicar_nodo()
              });

              Toast.fire({
                icon: 'success',
                title: 'Eliminado'
              })
            },
            error: function (err) {
              console.log(err);
            }
          });
        },
      },
      rowDoubleClick: function(args){
        console.log(args.item)
        // Cargamos el historial del base line
        JsGridBaseLine.jsGrid("loadData",{ data : []});
        cargarDataJsGridBaseLine(args.item.id)
        JsGridHistorialInspecciones.jsGrid("loadData",{ data : []});
        cargarDataJsGridHistorialInspecciones(args.item.id)
        document.querySelector("#Id_InspeccionBL").value = idInspeccion;
        document.querySelector("#Id_UbicacionBL").value = args.item.id;
        document.querySelector("#Id_Inspeccion_Det_BL").value = args.item.Id_Inspeccion_Det
        document.querySelector("#rutaBaseLine").value = sitioRuta.concat(args.item.path);
        
        return editarUbicacion(args);
      },
      // deleteConfirm: function(item){
      //   return `El registro "${item.nameUbicacion}" será eliminado, ¿Esta seguro?`;
      // },
      fields: [
        { name: "nameUbicacion", title:"Ubicación", type: "text", css:"noWrap", width:250, validate: "required",
          itemTemplate : function (value, item) {
            return icono(value,item);
          }
        },
        { name: "Codigo_Barras", title:"Codigo barras", type: "text", align:"center", validate: "required" },
        { name: "Estatus_Inspeccion_Det", title:"Estatus", type: "text", align:"center" },
        { type: "control", modeSwitchButton: false, editButton: false, width:23,
          itemTemplate: function(value, item) {
            var btnEliminarItem = $("<button>")
            .click(function(e) {
              Swal.fire({
                title: 'Eliminar',
                html: `El registro "${item.nameUbicacion}" será eliminado, ¿Esta seguro?`,
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Eliminacion logica de la BD
                  JsGridInventario.jsGrid("deleteItem", item);
                }
              })
            });

            btnEliminarItem[0].classList.add("jsgrid-button");
            btnEliminarItem[0].classList.add("jsgrid-delete-button");
            btnEliminarItem[0].title = "Eliminar";

            return btnEliminarItem;
          }
        }
      ]

    });

  }

  function icono(value,item){
    var span = document.createElement('span');
    var icono = document.createElement('i');

    if(item.Es_Equipo == 'SI'){
      icono.className = "fas fa-traffic-light";
    }else{
      icono.className = "fas fa-grip-vertical";
    }

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = `${item.Id_Inspeccion_Det}`;
    checkbox.name= "checkUbicacionesJsGrid";
    checkbox.classList.add("checkBoxEstatusJsGrid");

    span.append(checkbox,` `,icono,` ${value}`);

    return span;

  }

  function iniciarElementos(){
    unselectedNodo()

    limpiar_frm_ubicaciones_baseline();
    console.log(datos_treeview_iniciales)
    // if(datos_treeview_iniciales != ''){
    //   if (datos_treeview_iniciales[0].text == 'No Members is presnt in list'){
    //     datos_treeview_iniciales = [];
    //   }
    // }

    cargar_datos_treeview().then(() => {
      filtrarProblemas();
    })
    // TreeView.treeview('uncheckAll', { silent: true });
    // JsGridInventario.jsGrid("loadData",{ data : datos_treeview_iniciales});

    // Limpiamos el array para agregar nuevos id para filtrar
    // arrayUbicacionesFiltro = [];
    /* cgecar esta parte porque marca error con la promesa */
    // filtrarProblemas();
  }

  function limpiarChecksEstatus(){

    // if (!document.querySelector("#checkLista").checked){
    //   console.log('en el tree')
    //   console.log(elementosSeleccionadosTree)
    // }else{
    //   elementosSeleccionadosJsGrid = [];
    //   console.log('en el jsGrid')
    //   $('input[type=checkbox][name="checkUbicacionesJsGrid"]:checked').each(function() {
    //     elementosSeleccionadosJsGrid.push($(this).val());
    //   });
    //   console.log(elementosSeleccionadosJsGrid)
    // }

    TreeView.treeview('uncheckAll', { silent: $('#chk-check-silent').is(':checked') });

    $('input[type=checkbox][name="checkUbicacionesJsGrid"]:checked').each(function(checkBox) {
      checkBox = $(this)[0];
      checkBox.checked = false;
    });

  }

  function nuevoRegistro(){
    console.log(nodoSeleccionado)
    if(!nodoSeleccionado.esEquipo){
      $('#modalAgregarUbicacion').modal('show');
    }else{
      Swal.fire({
        title: '',
        html: `Solo puede crear elementos dentro de ubicaciones`,
        icon: 'warning',
        showCancelButton: false,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          limpiar_frm_ubicaciones_baseline();
        }
      })
    }

    document.querySelector("#FormInventarios").removeAttribute("action");
    document.querySelector("#FormInventarios").setAttribute("action",`/inventarios/nuevo`);
    document.querySelector("#CardBaseLine").classList.add("disable");
    document.querySelector('#Id_Tipo_Prioridad').value = "6F5F0EB1-76B8-11D3-82BF-00104BC75DC2";
    // document.querySelector('#ruta_nueva_ubicacion').value = StrRuta;

    $("h4").find("span").text("Agregar Ubicación");

    // colocarRuta('pathUbicacion');
    
    // Antes del proceso DB
    // document.querySelector('#Test_Estatus').value = 1;
    document.querySelector('#Test_Estatus').value = "568798D1-76BB-11D3-82BF-00104BC75DC2";

  }

  function guardarDatos(){
    if($("#FormInventarios").valid()){
      // Obtenemos la operacion a realizar create ó update
      var form_action = $("#FormInventarios").attr("action");
      // Guardamos el form con los input file para subir archivos
      var formData = new FormData(document.getElementById("FormInventarios"));

      var objetformData = formDataToObjet(formData);
      console.log(objetformData)

      $.ajax({
        data: formData,
        url: form_action,
        type: "POST",
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (res) {
          console.log(res)
          // creamos de nuevo el treeview actualizado
          cargar_datos_treeview().then(() => {
            ubicar_nodo()
          });

          // Se cierra el modal
          $('#modalAgregarUbicacion').modal('hide');
          // Mostramos mensaje de operacion exitosa
          Toast.fire({
            icon: 'success',
            title: 'Agregado'
          })
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
  };

  /* Funcion que que expande el arbol en el nodo que se habia seleccionado */
  /* Recibe un parametro solo cuando se quiere ubicar el nodo despues de generar un problema */
  function ubicar_nodo(es_problema = false) {
    let element_list = document.querySelector(`[data-nodeid="${nodoSeleccionado.nodeId}"]`);

    console.log(element_list)
    // if (element_list === null) {
    //   console.log("sin nodo seleccionado")
    //   return;
    // }

    if (es_problema) {
      console.log("entro al if")
      console.log(element_list)
      $('#treeview').treeview('revealNode',[ nodoSeleccionado.nodeId ,{ silent: true }]);
      console.log("1")
      element_list.click()
      console.log("2")
      return;
    }

    console.log("No entro al if")

    /* de los datos del nodo que se selecciono le sumamos 1 al nodeid que se genera y
    se expande el tree para mostrar ese elemento nuevo generado */
    console.log(nodoSeleccionado.nodeId)
    if (nodoSeleccionado.nodeId == undefined || nodoSeleccionado.nodeId == null) {
      console.log("nada seleccionado")
      return;
    }
    nodoSeleccionado.nodeId++
    $('#treeview').treeview('revealNode',[ nodoSeleccionado.nodeId ,{ silent: true }]);
    console.log(nodoSeleccionado.nodeId)
    /* Para mostrar los elementos que contiene el nodo seleccionado volvemos a quitarle 1
    y ejecutamos el click simulando la selccion para cargar los datos en el jsgrid */
    nodoSeleccionado.nodeId--
    element_list = document.querySelector(`[data-nodeid="${nodoSeleccionado.nodeId}"]`);
    element_list.click()
    console.log(nodoSeleccionado.nodeId)
  }

  function editarUbicacion(args){
    let item = args.item;
    console.log(item)

    document.querySelector("#FormInventarios").removeAttribute("action");
    document.querySelector("#FormInventarios").setAttribute("action",`/inventarios/update`);

    document.querySelector('#Nivel_arbol').value = item.level;
    document.querySelector('#Id_Ubicacion').value = item.id;
    document.querySelector('#Id_Ubicacion_padre').value = item.Id_Ubicacion_padre;
    document.querySelector('#Id_Inspeccion_Det').value = item.Id_Inspeccion_Det;

    document.querySelector('#Test_Estatus').value = item.Id_Status_Inspeccion_Det;
    document.querySelector('#Ubicacion').value = item.nameUbicacion;
    document.querySelector('#Descripcion').value = item.Descripcion;
    document.querySelector('#Id_Tipo_Prioridad').value = item.Id_Tipo_Prioridad;
    document.querySelector('#Codigo_Barras').value = item.Codigo_Barras;
    document.querySelector('#Id_Fabricante').value = item.Id_Fabricante;

    if(item.Es_Equipo == "SI"){
      document.querySelector('#Es_Equipo').checked = true;
    }

    document.querySelector("#CardBaseLine").classList.remove("disable");
    $("h4").find("span").text("Modificar Ubicación");
    colocarRuta('pathUbicacion',item.path);

    $('#modalAgregarUbicacion').modal('show');
  }

  // Función que restablece todo el form
  function limpiar_frm_ubicaciones_baseline(){
    console.log('se cerro mdl');
    colocarRuta('pathUbicacion');
    
    // Limpia los valores del form
    $('#FormInventarios')[0].reset();
    // Quita los mensajes de error y limpia los valodes del form
    procesoValidacionFormInventarios.resetForm();
    // Quita los estilos de error de los inputs
    $('#FormInventarios').find(".is-invalid").removeClass("is-invalid");
    $(".datosImg").empty();
    
    // Asignacion de valores para el alta de una ubicación
    document.querySelector('#Nivel_arbol').value = 1;
    document.querySelector("#Id_Ubicacion_padre").value = 0;
    document.querySelector("#ruta_nueva_ubicacion").value = '';
  }

  function unselectedNodo(){
    console.log(nodoSeleccionado)
    // Limpiamos el array para agregar nuevos id para filtrar
    arrayUbicacionesFiltro = []
    // Limpiamos las variables para el alta de un problema
    // nodoSeleccionado.estatus = false;
    // nodoSeleccionado.esEquipo = false;
    // idInspeccion_Det = '';
    // idUbicacion = '';
    // StrEquipo = '';
    // StrRuta = '';
    nodoSeleccionado.estatus=false;
    nodoSeleccionado.esEquipo= false;
    nodoSeleccionado.Id_Ubicacion_padre=0;
    nodoSeleccionado.Nivel_arbol=1;
    delete nodoSeleccionado.nodeId;
    nodoSeleccionado.ruta= '';

    // // Asignacion de valores para el alta de una ubicación
    // document.querySelector('#Nivel_arbol').value = nodoSeleccionado.Nivel_arbol;
    // document.querySelector("#Id_Ubicacion_padre").value = nodoSeleccionado.Id_Ubicacion_padre;
    // document.querySelector("#ruta_nueva_ubicacion").value = nodoSeleccionado.ruta;

    // var findSelectableNodes = function() {
    //   return TreeView.treeview('search', [ $('.node-selected').text(), { ignoreCase: true, exactMatch: false } ]);
    // };
    // var selectableNodes = findSelectableNodes();
    // if(selectableNodes !== ''){
    //   TreeView.treeview('unselectNode', [ selectableNodes, { silent: true}]);
    // }

    // filtrarProblemas()

  }

  function validarFrmInventario(){
    procesoValidacionFormInventarios = $('#FormInventarios').validate({
      rules: {
        Test_Estatus: {
          required: true,
        },
        Ubicacion: {
          required: true
        },
      },
      messages: {
        Test_Estatus: {
          required: "Seleccionar estatus"
        },
        Ubicacion: {
          required: "Ingresa un nombre de ubicacion"
        }
      },
      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
      }
    });
  }

  function colocarRuta(idElemento,path = ''){
    // Concatemanos el sitioRuta con el valor de path para mostrar la ruta en que esta situado el usuario
    document.querySelector(`#${idElemento}`).textContent = '';
    document.querySelector(`#${idElemento}`).textContent = sitioRuta.concat(path);
  }

  // PROBLEMAS
  function nuevoProblema(){
    console.log(nodoSeleccionado)
    if(nodoSeleccionado.estatus){

      document.querySelector("#FrmProblemas").removeAttribute("action");
      document.querySelector("#FrmProblemas").setAttribute("action",`/inventarios/nuevoProblema`);

      if(nodoSeleccionado.esEquipo){
        $('#modalSeleccionarProblema').modal('show');
      }else{
        Swal.fire({
          title: 'Está a punto de crear un registro de inspección visual.',
          html: `Actualmente tiene una ubicación seleccionada (en lugar de equipo).
                Solo puede crear registros de inspección visual para ubicaciones.
                <br>¿Le gustaría agregar un registro de inspección visual?`,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            document.querySelector("#customRadio2").checked = true;
            cambiarMdl()
            $('#frmSeleccionarProblema')[0].reset();
          }
        })
      }

    }else{
      // Mostramos mensaje de alerta
      Toast.fire({
        icon: 'error',
        title: 'Seleccionar elemento'
      })
    }
  }

  function cambiarMdl(){

    var opSeleccionada = $("input[type='radio'][name='seleccionProblema']:checked").val();
    document.querySelector('#Id_Tipo_Inspeccion').value = opSeleccionada;
    
    $.ajax({
      url: `inventarios/getNumero_Problema`,
      data:{Id_Inspeccion:idInspeccion,Id_Tipo_Inspeccion:opSeleccionada},
      type: "POST",
      dataType: 'json',
      success: function (valoresDefaulProblema) {

        if (valoresDefaulProblema != null){
          document.querySelector('#Numero_Problema').value = (parseInt(valoresDefaulProblema.Numero_Problema) + 1);
          valoresCheckProblemas(valoresDefaulProblema);
        }else{
          console.log('entro el else')
          document.querySelector('#Numero_Problema').value = 1;
        }
    
      },
      error: function (err) {
        console.log(err);
      }
    });

    // Inicialmente mostranos el tab de imagenes para el problema electrico y mecanico
    document.querySelector("#menuTabsProblemaElectricoMecanico").style.display = '';

    switch (opSeleccionada) {
      // problema electrico
      case '0D32B331-76C3-11D3-82BF-00104BC75DC2':
        StrTipoInspeccion = 'Eléctrico';
        mostrarFormularioProblema('divProblemaElectrico',opSeleccionada);
        document.querySelector(`#StrRuta`).value = StrRuta;
        crearSelectFallaProblemas(opSeleccionada,"Id_Falla");
        break;
      // problema visual
      case '0D32B333-76C3-11D3-82BF-00104BC75DC2':
        StrTipoInspeccion = 'Visual';
        // Si es un problema visual ocultamos los tabs de imagenes del problema electrico y mecanico
        // document.querySelector("#menuTabsProblemaElectricoMecanico").style.display = 'none';
        mostrarFormularioProblema('divProblemaVisual');
        document.querySelector(`#StrRutaVisual`).value = StrRuta;
        break;
      // problema mecanico
      case '0D32B334-76C3-11D3-82BF-00104BC75DC2':
        StrTipoInspeccion = 'Mecánico';
        mostrarFormularioProblema('divProblemaElectrico',opSeleccionada);
        document.querySelector(`#StrRuta`).value = StrRuta;
        crearSelectFallaProblemas(opSeleccionada,"Id_Falla");
        break;
      default:
        StrTipoInspeccion = 'Eléctrico';
      break;
    }
    
    document.querySelector('#tituloModalProblemas').textContent = `Problema ${StrTipoInspeccion}`;
    document.querySelector('#StrTipoInspeccion').value = StrTipoInspeccion;
    document.querySelector('#StrEquipo').value = StrEquipo;
    // document.querySelector(`#StrRuta`).value = StrRuta;

    // Cierra el primer modal
    $('#modalSeleccionarProblema').modal('hide');
    // Espera a que se oculte completamente el primer modal y muestra el segundo
    $('#modalProblemas').modal('show');
  }

  function validarFrmProblemas(){
    procesoValidacionFormProblemas = $('#FrmProblemas').validate({
      rules: {
        Id_Tipo_Inspeccion: {required: false,},
        Numero_Problema: {required: false,},
        Id_Sitio: {required: false,},
        Id_Inspeccion: {required: false,},
        Id_Ubicacion: {required: false,},
        Problem_Temperature: {
          required: true,
          number: true,
        },
        Reference_Temperature: {
          required: true,
          number: true,
        },
        Problem_Phase: {required: true,},
        Reference_Phase: {required: true,},
        Problem_Rms: {
          required: false,
          number: true,
        },
        Reference_Rms: {
          required: false,
          number: true,
        },
        Additional_Info: {required: false,},
        Additional_Rms: {
          required: false,
          number: true,
        },
        Emissivity_Check: {required: false,},
        Emissivity: {required: false,min:0, max:1},
        Indirect_Temp_Check: {required: false,},
        Temp_Ambient_Check: {required: false,},
        Temp_Ambient: {
          required: false,
          number: true,
        },
        Environment_Check: {required: false,},
        Environment: {required: false,},
        Ir_File: {required: true,},
        Photo_File: {required: true,},
        Wind_Speed_Check: {required: false,},
        Wind_Speed: {
          required: false,
          number: true,
        },
        idFabricanteProblemas: {required: false,},
        Rated_Load_Check: {required: false,},
        Rated_Load: {
          required: false,
          number: true,
        },
        Circuit_Voltage_Check: {required: false,},
        Circuit_Voltage: {
          required: false,
          number: true,
        },
        Id_Falla: {required: true,},
        Component_Comment: {required: false,},
        Ruta: {required: false,},
        // Campos problema visual
        hazard_Type: {required: false,},
        hazard_Classification: {required: false,},
        hazard_Group: {required: false,},
        hazard_Issue: {required: true,},
        Id_Severidad: {required: true,},
      },
      messages: {
        Id_Tipo_Inspeccion: {required: "Seleccionar tipo de inspección",},
        Numero_Problema: {required: "El número es requerido",},
        Id_Sitio: {required: "El sitio es requerido",},
        Id_Inspeccion: {required: "La inspección es requerida",},
        Id_Ubicacion: {required: "El equipo es requido",},
        Problem_Temperature: {
          required: "Ingresar temperatura",
          number: "Solo ingresar números"
        },
        Reference_Temperature: {
          required: "Ingresar temperatura",
          number: "Solo ingresar números"
        },
        Problem_Phase: {required: "Ingresar phase",},
        Reference_Phase: {required: "Ingresar phase",},
        Problem_Rms: {
          required: "Ingresar RMS",
          number: "Solo ingresar números"
        },
        Reference_Rms: {
          required: "Ingresar RMS",
          number: "Solo ingresar números"
        },
        Additional_Info: {required: "Seleccionar opción",},
        Additional_Rms: {
          required: "Ingresar RMS",
          number: "Solo ingresar números"
        },
        Emissivity: {required: "Fuera del rango valido", min: "Ingresar valor entre 0.00 y 1.00", max: "Ingresar valor entre 0.00 y 1.00"},
        Temp_Ambient: {
          required: "Ingresar Temp Ambiente",
          number: "Solo ingresar números"
        },
        Environment: {required: "Ingresar environment",},
        Ir_File: {required: "Agregar imagen térmica",},
        Photo_File: {required: "Agregar imagen digital",},
        Wind_Speed: {
          required: "Ingresar wind speed",
          number: "Solo ingresar números"
        },
        idFabricanteProblemas: {required: "Seleccionar fabricante",},
        Rated_Load: {
          required: "Ingresar rated load",
          number: "Solo ingresar números"
        },
        Circuit_Voltage: {
          required: "Ingresar circuit voltage",
          number: "Solo ingresar números"
        },
        Id_Falla: {required: "Seleccionar falla",},
        Component_Comment: {required: "Ingresar comment",},
        Ruta: {required: "La ruta es requerida",},
        // Campos problema visual
        hazard_Type: {required: "Seleccionar tipo",},
        hazard_Classification: {required: "Seleccionar clasificación",},
        hazard_Group: {required: "Seleccionar grupo",},
        hazard_Issue: {required: "Seleccionar problema",},
        Id_Severidad: {required: "Seleccionar severidad",},
      },
      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.input-group').append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
      }
    });
  }

  function guardarDatosProblema(){
    console.log(idInspeccion_Det)
    console.log(idUbicacion)
    if($("#FrmProblemas").valid() && Ir_File.value != '' && Photo_File.value != ''){

      onlyClick(btnGuardarProblema)

      // Obtenemos la operacion a realizar create ó update
      var form_action = $("#FrmProblemas").attr("action");
      // Guardamos el form con los input file para subir archivos
      var formData = new FormData(document.getElementById("FrmProblemas"));
      
      // Datos que se agregan solo en el alta de un nuevo problema
      formData.append('Id_Sitio',idSitio);
      formData.append('Id_Inspeccion',idInspeccion);
      formData.append('Id_Inspeccion_Det',idInspeccion_Det);
      formData.append('Id_Ubicacion',idUbicacion);

      $.ajax({
        data: formData,
        url: form_action,
        type: "POST",
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (res) {
          console.log(form_action)
          cargarDataJsGridProblemas()

          if (form_action != '/inventarios/updateProblema') {
            // creamos de nuevo el treeview actualizado
            cargar_datos_treeview().then(() => {
              ubicar_nodo(true)
            }); 
          }

          // Mostramos mensaje de operacion exitosa
          Toast.fire({
            icon: 'success',
            title: 'Agregado'
          })
          
          // Ocultamos el modal
          $('#modalProblemas').modal('hide');
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
  };

  function cargarDataJsGridProblemas(){
    if(idSitio == "" || idSitio == null){
      return;
    }

    $.ajax({
      url: `inventarios/getProblemas_Sitio/${idSitio}`,
      type: "POST",
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (res) {
        console.log(res)
        dataGridProblemas = res;
        filtrarProblemas()
        // JsGridProblemas.jsGrid("loadData",{ data : res});
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function cargarJsGridProblemas(){
    // Creacion del jsGrid
    JsGridProblemas = $("#jsGridProblemas").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      selecting: true,
      paging: false,
      // pageSize: 15,
      autoload: false,
      filtering: false,
      noDataContent: "La lista esta vacía",
      confirmDeleting: false,

      controller: {
        loadData: function(filter){
          return filter.data
        },
        deleteItem: function(item) {
          return $.ajax({
            url: "/inventarios/eliminarProblema/"+item.Id_Problema,
            dataType: 'json',
            success: function (res) {
              // creamos de nuevo el treeview actualizado
              cargar_datos_treeview().then(() => {
                ubicar_nodo()
              });
              
              cargarDataJsGridProblemas()
              Toast.fire({
                icon: 'success',
                title: 'Eliminado'
              })
            },
            error: function (err) {
              console.log(err);
            }
          });
        },
      },
      rowDoubleClick: function(args){
        console.log(args.item);
        // console.log(args.item)
        dataFilasJsGridProblemas = $("#jsGridProblemas").jsGrid("option", "data");
        totalFIlasProblemas = dataFilasJsGridProblemas.length - 1;
        filaActualJsGridProblemas = args.itemIndex;
        
        ajustesEditarProblema()

      },
      // deleteConfirm: function(item){
      //   return `El problema ${item.Numero_Problema} del ${item.nombreEquipo} será eliminado, ¿Esta seguro?`;
      // },
      fields: [ 
        { name: "Numero_Problema", title:"No", type: "number", width: 25 ,align:"center",},
        { name: "Fecha_Creacion", title:"Fecha", type: "text",align:"center",
          itemTemplate : function (value, item) {
            return new Date(value).toLocaleDateString();
          }
        },
        { name: "numInspeccion", title:"No. Insp", type: "number",align:"center",},
        { name: "tipoInspeccion", title:"Tipo", type: "text",align:"center",},
        { name: "Estatus_Problema", title: "Estatus", type: "text" ,align:"center",},
        { name: "Es_Cronico", title: "Crónico", type: "text",align:"center",},
        { name: "Problem_Temperature", title: "Temp °C", type: "number",align:"center",},
        { name: "Aumento_Temperatura", title: "DeltaT °C", type: "number",align:"center",},
        { name: "StrSeveridad", title: "Severidad", type: "text",align:"center",},
        { name: "nombreEquipo", title: "Equipo", type: "text",width:310,align:"letf"},
        { name: "Component_Comment", title: "Comentarios", type: "text", width: 550,align:"left",},
        { type: "control", modeSwitchButton: false, editButton: false,
          itemTemplate: function(value, item) {
            var btnEliminarItem = $("<button>")
            .click(function(e) {
              Swal.fire({
                title: 'Eliminar',
                html: `El problema ${item.Numero_Problema} del ${item.nombreEquipo} será eliminado,<br> deberá verificar la numeración del etiquetado del problema.`,
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Eliminacion logica del arreglo global que contiene todo los problemas
                  // dataGridProblemas.forEach(element => {
                  //   if (element.Id_Problema == item.Id_Problema) {
                  //     element.Estatus = "Inactivo";
                  dataGridProblemas = dataGridProblemas.filter((problema) => problema.Id_Problema != item.Id_Problema);

                  // Eliminacion logica de la BD
                  JsGridProblemas.jsGrid("deleteItem", item);
                }
              })
            });

            btnEliminarItem[0].classList.add("jsgrid-button");
            btnEliminarItem[0].classList.add("jsgrid-delete-button");
            btnEliminarItem[0].title = "Eliminar";

            if (item.Id_Inspeccion == idInspeccion){
              return btnEliminarItem;
            }
          }
        }
      ]

    });

  }

  function ajustesEditarProblema(){
    var valoresItem = dataFilasJsGridProblemas[filaActualJsGridProblemas];
    console.log(valoresItem)
    console.log(valoresItem.numInspeccion)
    console.log(strNumInspeccion.value)
    // Mostramos Botones de navegacion
    document.querySelector("#contenedorBtnNavegacionProblemas").style.display = ""

    // Cargamos los el historial del problema en el jsgrid de historial
    cargarDataJsGridHistorialProblemas(valoresItem.Id_Problema);

    // Asignacion de valores para editar un problema
    idInspeccion_Det = valoresItem.Id_Inspeccion_Det;
    idUbicacion = valoresItem.Id_Ubicacion;

    // cambiando el Action del form para editar problema
    document.querySelector("#FrmProblemas").removeAttribute("action");
    document.querySelector("#FrmProblemas").setAttribute("action",`/inventarios/updateProblema`);
    // Mostramos la fila con los botones de cerrar problema y problema cronico
    document.querySelector('#rowCronicoEstatus').style.display = 'block';
    // Validando que sean problemas pasados y abiertos para poder hacerlos cronicos
    if(parseInt(valoresItem.numInspeccion) < parseInt(strNumInspeccion.value) && valoresItem.Estatus_Problema === "Abierto"){
      document.querySelector('#divCronico').style.display = 'block';
    }else{
      document.querySelector('#divCronico').style.display = 'none';
    }
    // Validando si ya es un problema cronico para activar el checBox
    if(valoresItem.Es_Cronico == "SI"){
      document.querySelector("#labelCronico").classList.add("text-danger");
      document.querySelector("#Es_Cronico").checked = true;
    }else{
      document.querySelector("#labelCronico").classList.remove("text-danger");
      document.querySelector("#Es_Cronico").checked = false;
    }
    // Validando si ya esta cerrado para activar el checkBox
    if(valoresItem.Estatus_Problema == "Cerrado"){
      document.querySelector("#Estatus_Problema").checked = true;
    }else{
      document.querySelector("#Estatus_Problema").checked = false;
    }

    // Colocando titulo Modal
    document.querySelector('#tituloModalProblemas').textContent = `Detalles del problema ${valoresItem.tipoInspeccion}`;

    // Colocando los valores para los campos ocultos
    document.querySelector("#Id_Problema").value = valoresItem.Id_Problema;
    document.querySelector("#Id_Tipo_Inspeccion").value = valoresItem.Id_Tipo_Inspeccion;
    document.querySelector("#id_ubicacion_original_referencia").value = valoresItem.Id_Ubicacion;

    if (valoresItem.Id_Tipo_Inspeccion == "0D32B331-76C3-11D3-82BF-00104BC75DC2" || valoresItem.Id_Tipo_Inspeccion == "0D32B332-76C3-11D3-82BF-00104BC75DC2" || valoresItem.Id_Tipo_Inspeccion == "0D32B334-76C3-11D3-82BF-00104BC75DC2") {
      // Inicialmente mostranos el tab de imagenes para el problema electrico y mecanico
      document.querySelector("#menuTabsProblemaElectricoMecanico").style.display = '';
      mostrarFormularioProblema('divProblemaElectrico',valoresItem.Id_Tipo_Inspeccion);
      crearSelectFallaProblemas(valoresItem.Id_Tipo_Inspeccion,"Id_Falla");
      return editarProblemaElectrico(valoresItem);
    } else {
      // Si es un problema visual ocultamos los tabs de imagenes del problema electrico y mecanico
      // document.querySelector("#menuTabsProblemaElectricoMecanico").style.display = 'none';
      mostrarFormularioProblema('divProblemaVisual');
      return editarProblemaVisual(valoresItem);
    }
  }

  function editarProblemaElectrico(item){
    document.querySelector('#rowEditElectrico').style.display = '';
    document.querySelector('#rowNew').style.display = 'none';

    document.querySelector("#strNumInspeccionEdit").value = item.numInspeccion;
    document.querySelector("#Numero_ProblemaEdit").value = item.Numero_Problema;
    document.querySelector('#StrTipoInspeccionEdit').value = item.tipoInspeccion;

    document.querySelector("#Problem_Temperature").value = item.Problem_Temperature;
    document.querySelector("#Reference_Temperature").value = item.Reference_Temperature;
    document.querySelector("#Problem_Phase").value = item.Problem_Phase;
    document.querySelector("#Reference_Phase").value = item.Reference_Phase;
    document.querySelector("#Problem_Rms").value = item.Problem_Rms;
    document.querySelector("#Reference_Rms").value = item.Reference_Rms;
    document.querySelector("#Additional_Info").value = item.Additional_Info;
    document.querySelector("#Additional_Rms").value = item.Additional_Rms;
    document.querySelector("#Emissivity").value = item.Emissivity;
    document.querySelector("#Temp_Ambient").value = item.Temp_Ambient;
    document.querySelector("#Environment").value = item.Environment;
    document.querySelector("#Wind_Speed").value = item.Wind_Speed;
    document.querySelector("#idFabricanteProblemas").value = item.Id_Fabricante;
    document.querySelector("#Rated_Load").value = item.Rated_Load;
    document.querySelector("#Circuit_Voltage").value = item.Circuit_Voltage;
    document.querySelector("#Id_Falla").value = item.Id_Falla;
    document.querySelector("#Component_Comment").value = item.Component_Comment;
    document.querySelector("#StrRuta").value = item.Ruta;
    document.querySelector('#StrEquipo').value = item.nombreEquipo;
    document.querySelector('#aumentoTemp').value = item.Aumento_Temperatura;
    document.querySelector('#StrSeveridad').value = item.StrSeveridad;
    document.querySelector("#Ir_File").value = item.Ir_File;
    document.querySelector("#Photo_File").value = item.Photo_File;
    document.querySelector("#imgIR_Problema").src = `public/Archivos_ETIC/inspecciones/${item.numInspeccion}/Imagenes/${item.Ir_File}`
    document.querySelector("#imgID_Problema").src = `public/Archivos_ETIC/inspecciones/${item.numInspeccion}/Imagenes/${item.Photo_File}`
    datosImg(document.querySelector("#imgIR_Problema"), item.Ir_File, item.Id_Inspeccion, item.numInspeccion);
    datosImg(document.querySelector("#imgID_Problema"), item.Photo_File, item.Id_Inspeccion, item.numInspeccion);

    document.querySelector('#Rpm').value = item.Rpm;
    document.querySelector('#Bearing_Type').value = item.Bearing_Type;

    valoresCheckProblemas(item);
    
    // document.querySelector("#CardBaseLine").classList.remove("disable");
    colocarRuta('pathUbicacion',item.path);

    $('#modalProblemas').modal('show');
  }

  function editarProblemaVisual(item){
    // console.log(item)
    // Mostramos la fila con los datos con los campos de numero idInspeccion
    // numero problema, tipo de inpeccion y equipo
    document.querySelector('#rowEditVisual').style.display = 'block';
    document.querySelector('#rowNew').style.display = 'none';

    // Colocando valores a los campos que identifican al problema
    document.querySelector("#strNumInspeccionEditVisual").value = item.numInspeccion;
    document.querySelector("#Numero_ProblemaEditVisual").value = item.Numero_Problema;
    document.querySelector('#StrTipoInspeccionEditVisual').value = item.tipoInspeccion;
    document.querySelector('#StrEquipoEditVisual').value = item.nombreEquipo;
    document.querySelector("#StrRutaVisual").value = item.Ruta;
    // Colocando valores a los campos del problema visual
    // document.querySelector("#hazard_Type").value = item.hazard_Type;
    // document.querySelector("#hazard_Classification").value = item.hazard_Classification;
    // document.querySelector("#hazard_Group").value = item.hazard_Group;
    document.querySelector("#hazard_Issue").value = item.hazard_Issue;
    // document.querySelector("#Id_Severidad").value = item.Id_Severidad


    // VALIDACION TEMPORAL EN LO QUE SE MODIFICA EL PROCESO DB PARA UNIFICAR TODOS LOS ID
    if(item.Id_Severidad == "1D56EDB0-8D6E-11D3-9270-006008A19766" ||
    item.Id_Severidad == "222FE529-FDE8-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "D67243F8-FBCF-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "DA0E3747-E113-11D4-8336-006097AB6D58"){
      document.querySelector("#Id_Severidad").value = "1D56EDB0-8D6E-11D3-9270-006008A19766";
    }else if(item.Id_Severidad == "1D56EDB2-8D6E-11D3-9270-006008A19766" ||
    item.Id_Severidad == "222FE525-FDE8-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "D67243FE-FBCF-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "DA0E374B-E113-11D4-8336-006097AB6D58"){
      document.querySelector("#Id_Severidad").value = "1D56EDB2-8D6E-11D3-9270-006008A19766";
    }else if(item.Id_Severidad == "1D56EDB3-8D6E-11D3-9270-006008A19766" ||
    item.Id_Severidad == "222FE523-FDE8-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "D67243FC-FBCF-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "DA0E374D-E113-11D4-8336-006097AB6D58"){
      document.querySelector("#Id_Severidad").value = "1D56EDB3-8D6E-11D3-9270-006008A19766";
    }else if(item.Id_Severidad == "1D56EDB4-8D6E-11D3-9270-006008A19766" ||
    item.Id_Severidad == "222FE521-FDE8-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "D67243FA-FBCF-11D4-833C-006097AB6D58"){
      document.querySelector("#Id_Severidad").value = "1D56EDB4-8D6E-11D3-9270-006008A19766";
    }else if(item.Id_Severidad == "1D56EDB1-8D6E-11D3-9270-006008A19766" ||
    item.Id_Severidad == "222FE527-FDE8-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "D6724400-FBCF-11D4-833C-006097AB6D58" ||
    item.Id_Severidad == "DA0E3749-E113-11D4-8336-006097AB6D58"){
      document.querySelector("#Id_Severidad").value = "1D56EDB1-8D6E-11D3-9270-006008A19766";
    }

    document.querySelector("#observaciones_Visual").value = item.Component_Comment;
    // Mostrando al usuario la imagen que se guarado en el alta
    document.querySelector("#Ir_File").value = item.Ir_File;
    document.querySelector("#Photo_File").value = item.Photo_File;
    document.querySelector("#imgIR_Problema").src = `public/Archivos_ETIC/inspecciones/${item.numInspeccion}/Imagenes/${item.Ir_File}`
    document.querySelector("#imgID_Problema").src = `public/Archivos_ETIC/inspecciones/${item.numInspeccion}/Imagenes/${item.Photo_File}`
    datosImg(document.querySelector("#imgIR_Problema"), item.Ir_File, item.Id_Inspeccion, item.numInspeccion);
    datosImg(document.querySelector("#imgID_Problema"), item.Photo_File, item.Id_Inspeccion, item.numInspeccio);

    $('#modalProblemas').modal('show')
  }

  function valoresCheckProblemas(item){
    if(item.Indirect_Temp_Check == "on"){
      document.querySelector("#Indirect_Temp_Check").checked = true;
    }
    if(item.Emissivity_Check == "on"){
      document.querySelector("#Emissivity_Check").checked = true;
      document.querySelector("#Emissivity").value = item.Emissivity;
    }
    if(item.Temp_Ambient_Check == "on"){
      document.querySelector("#Temp_Ambient_Check").checked = true;
      document.querySelector("#Temp_Ambient").value = item.Temp_Ambient;
    }
    if(item.Environment_Check == "on"){
      document.querySelector("#Environment_Check").checked = true;
      document.querySelector("#Environment").value = item.Environment;
    }
    if(item.Wind_Speed_Check == "on"){
      document.querySelector("#Wind_Speed_Check").checked = true;
      document.querySelector("#Wind_Speed").value = item.Wind_Speed;
    }
    if(item.Rated_Load_Check == "on"){
      document.querySelector("#Rated_Load_Check").checked = true;
      document.querySelector("#Rated_Load").value = item.Rated_Load;
    }
    if(item.Circuit_Voltage_Check == "on"){
      document.querySelector("#Circuit_Voltage_Check").checked = true;
      document.querySelector("#Circuit_Voltage").value = item.Circuit_Voltage;
    }
  }

  function limpiarFrmProblemas(){
    console.log('se cerro mdl')
    // Asignacion de valores para el alta de un problema
    idInspeccion_Det = "";
    idUbicacion = "";

    // document.querySelector("#preview_Photo_File_Visual").src = "public/img/sistema/imagen-no-disponible.jpeg";
    document.querySelector("#imgIR_Problema").src = "public/img/sistema/imagen-no-disponible.jpeg";
    document.querySelector("#imgID_Problema").src = "public/img/sistema/imagen-no-disponible.jpeg";

    document.querySelector('#rowNew').style.display = '';
    document.querySelector('#divCerrado').style.display = '';
    document.querySelector('#rowEditElectrico').style.display = 'none';
    document.querySelector('#rowEditVisual').style.display = 'none';
    document.querySelector('#divCronico').style.display = 'none';
    document.querySelector('#rowCronicoEstatus').style.display = 'none';
    
    JsGridHistorialProblemas.jsGrid("loadData",{ data : []});

    // Limpia los valores del form
    $('#FrmProblemas')[0].reset();
    // Quita los mensajes de error y limpia los valodes del form
    procesoValidacionFormProblemas.resetForm();
    // Quita los estilos de error de los inputs
    $('#FrmProblemas').find(".is-invalid").removeClass("is-invalid");
    // Ocultando Botones de navegacion
    document.querySelector("#contenedorBtnNavegacionProblemas").style.display = "none"

    $(".datosImg").empty();
  }

  function crearComentario(event){
    var equip = document.querySelector('#StrEquipo').value;
    var problem = "";
    var element = "";
    var id_input = "Component_Comment";

    if(Id_Tipo_Inspeccion.value != "0D32B334-76C3-11D3-82BF-00104BC75DC2"){
      if(Id_Tipo_Inspeccion.value == "0D32B331-76C3-11D3-82BF-00104BC75DC2" || Id_Tipo_Inspeccion.value == "0D32B332-76C3-11D3-82BF-00104BC75DC2") {
        id_input = "Component_Comment";
        problem = selectFallaProblema.options[selectFallaProblema.selectedIndex].text;
        element = selectProblemPhase.options[selectProblemPhase.selectedIndex].text;
      }else if(Id_Tipo_Inspeccion.value == "0D32B333-76C3-11D3-82BF-00104BC75DC2") {
        id_input = "observaciones_Visual";
        problem = selectVisualGroup.options[selectVisualGroup.selectedIndex].text;
        element = selectVisualProblema.options[selectVisualProblema.selectedIndex].text;
      }
  
      document.querySelector(`#${id_input}`).value = (`${problem}, ${element}, ${equip}`).toUpperCase();
    }

  }

  function filtrarProblemas(){
    var filtroTipoVal = filtroTipoProblem.value;
    var filtroEstatusVal = filtroEstatus.value;
    var newdata=[];
    let new_data_filtro_BL = [];

    if(arrayUbicacionesFiltro == ''){
      // Filtrando listado de problemas por ubicacion del treeview
      newdata = dataGridProblemas;
      // Filtrando listado de BaseLine por ubicaciondel treeview
      new_data_filtro_BL = datos_base_line_filtro;
    }else{
      // Si se selecciono un item del treeview entonces en el array vienen los id
      arrayUbicacionesFiltro.forEach(id => {
        // FILTRANDO LISTADO DE PROBLEMAS
        // filtramos todos los problemas que sean iguales a los id de item seleccionado
        var resultados = dataGridProblemas.filter(problema => problema.Id_Ubicacion == id );
        // Si hay resutados iteramos el array con los resultados y lo vamos agregando al newdata para pasarlo a los otros filtros
        if(resultados != ''){
          resultados.forEach(element => {
            newdata = [...newdata, element]
          });
        }
        
        // FILTRANDO LISTADO DE BASELINE
        // filtramos todos los BL que sean iguales a los id de item seleccionado
        var resultados_BL = datos_base_line_filtro.filter(problema => problema.Id_Ubicacion == id );
        // Si hay resutados iteramos el array con los resultados_BL y lo vamos agregando al newdata para pasarlo a los otros filtros
        if(resultados_BL != ''){
          resultados_BL.forEach(element_bl => {
            new_data_filtro_BL = [...new_data_filtro_BL, element_bl]
          });
        }
      })
    }

    if(filtroTipoVal == 0){
      newdata = newdata;
    }else{
      newdata = newdata.filter(problema => problema.Id_Tipo_Inspeccion == filtroTipoVal);
    }

    switch (parseInt(filtroEstatusVal)) {
      case 1:
          newdata = newdata.filter(problema => problema.Estatus_Problema == "Abierto" && problema.Id_Inspeccion == idInspeccion);
        break;
      case 2:
          newdata = newdata.filter(problema => problema.Estatus_Problema == "Abierto" && problema.Id_Inspeccion != idInspeccion);
        break;
      case 3:
          newdata = newdata.filter(problema => problema.Estatus_Problema == "Abierto");
        break;
      case 4:
          newdata = newdata.filter(problema => problema.Estatus_Problema == "Cerrado");
        break;
      default:
      newdata = newdata;
    }

    // MOSTRANDO PROBLEMAS FILTRADOS
    JsGridProblemas.jsGrid("loadData",{ data : newdata});
    // MOSTRANDO BASELINE FILTRADOS
    JsGridListaBaseLine.jsGrid("loadData",{ data : new_data_filtro_BL});
  }

  function problemaCronico(){
    $.ajax({
      url: `inventarios/getNumero_Problema`,
      type: "POST",
      dataType: 'json',
      data: {Id_Inspeccion: idInspeccion, Id_Tipo_Inspeccion: Id_Tipo_Inspeccion.value, id_ubicacion_original: id_ubicacion_original_referencia.value},
      success: function (data) {
        console.log(data)
        console.log(data.id_inspeccion_detalle_actual.Id_Inspeccion_Det)
        
        
        let num_problema_anterior = data.numero_problema_actual;
        let numProblema_actual;
        num_problema_anterior != null ? numProblema_actual = (parseInt(num_problema_anterior.Numero_Problema) + 1) : numProblema_actual = 1;
        
        // Colocamos el action para el alta de problema
        document.querySelector("#FrmProblemas").removeAttribute("action");
        document.querySelector("#FrmProblemas").setAttribute("action",`/inventarios/guardarCronico`);
        // Colocamos el id_inspeccion_det actual de la ubicacion
        document.querySelector("#Id_Inspeccion_Det_Cronico").value = data.id_inspeccion_detalle_actual.Id_Inspeccion_Det
        
        // Colocando estilos para problema cronico
        document.querySelector('#divCerrado').style.display = 'none';
        document.querySelector("#labelCronico").classList.add("text-danger");
        document.querySelector("#Es_Cronico").checked = true;
        
        if (Id_Tipo_Inspeccion.value == "0D32B331-76C3-11D3-82BF-00104BC75DC2" || Id_Tipo_Inspeccion.value == "0D32B332-76C3-11D3-82BF-00104BC75DC2" || Id_Tipo_Inspeccion.value == "0D32B334-76C3-11D3-82BF-00104BC75DC2") {
          document.querySelector("#strNumInspeccionEdit").value = strNumInspeccion.value;
          document.querySelector('#Numero_ProblemaEdit').value = numProblema_actual;
        }else{
          document.querySelector("#strNumInspeccionEditVisual").value = strNumInspeccion.value;
          document.querySelector('#Numero_ProblemaEditVisual').value = numProblema_actual;
        }

      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function mostrarFormularioProblema(problema,idProblema = 0){
    document.querySelector('#divProblemaElectrico').style.display = 'none';
    document.querySelector('#divProblemaVisual').style.display = 'none';
    
    document.querySelector('#encabezado_datos_electrico').style.display = 'none';
    document.querySelector('#encabezado_datos_visual').style.display = 'none';

    var elementos = document.querySelectorAll('.campoProblemaElectrico');

    if (idProblema == "0D32B334-76C3-11D3-82BF-00104BC75DC2") {
      elementos.forEach(elemento => {
        elemento.style.display = "none"
      })
      document.querySelector('#encabezado_datos_electrico').style.display = '';
      document.querySelector('#divRpm').style.display = '';
      document.querySelector('#divTipoRodamiento').style.display = '';
      document.querySelector('#contenedorAux').style.display = '';
    }else if(idProblema == "0D32B331-76C3-11D3-82BF-00104BC75DC2" || idProblema == "0D32B332-76C3-11D3-82BF-00104BC75DC2"){
      elementos.forEach(elemento => {
        elemento.style.display = ""
      })
      document.querySelector('#encabezado_datos_electrico').style.display = '';
      document.querySelector('#divRpm').style.display = 'none';
      document.querySelector('#divTipoRodamiento').style.display = 'none';
      document.querySelector('#contenedorAux').style.display = 'none';

    }else{
      document.querySelector('#encabezado_datos_visual').style.display = '';
    }
    
    document.querySelector(`#${problema}`).style.display = '';
  }

  function cargarJsGridHistorialProblemas(){
    // Creacion del jsGrid
    JsGridHistorialProblemas = $("#jsGridHistorialProblemas").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      selecting: true,
      paging: false,
      pageSize: 5,
      autoload: false,
      filtering: false,
      noDataContent: "Sin registros",

      controller: {
        loadData: function(filter){
          return filter.data
        },
      },
      fields: [
        { name: "Numero_Problema", title:"No", type: "number", width: 25 ,align:"center",},
        { name: "numInspeccion", title:"No. Insp", type: "number",align:"center",},
        { name: "Fecha_Creacion", title:"Fecha", type: "text",align:"center",
          itemTemplate : function (value, item) {
            return new Date(value).toLocaleDateString();
          }
        },
        { name: "StrSeveridad", title: "Severidad", type: "text",align:"center",},
        { name: "notas", title: "Comentarios", type: "text", width: 400,align:"left",},
      ]

    });

  }

  function cargarDataJsGridHistorialProblemas(idProblema){
    $.ajax({
      url: `inventarios/getHistorialProblema/${idProblema}`,
      type: "POST",
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (res) {
        JsGridHistorialProblemas.jsGrid("loadData",{ data : res});
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function cargarJsGridBaseLine(){
    // Creacion del jsGrid
    JsGridBaseLine = $("#jsGridBaseLine").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      selecting: true,
      paging: false,
      pageSize: 10,
      autoload: false,
      filtering: false,
      noDataContent: "Sin registros",
      confirmDeleting: false,

      controller: {
        loadData: function(filter){
          return filter.data
        },
        deleteItem: function(item) {
          return $.ajax({
            url: "/inventarios/eliminarBaseLine/"+item.Id_Linea_Base,
            dataType: 'json',
            success: function (res) {
              // creamos de nuevo el treeview actualizado
              cargar_datos_treeview().then(() => {
                ubicar_nodo()
              });
              // Mostramos mensaje de operacion exitosa
              Toast.fire({
                icon: 'success',
                title: 'Eliminado'
              })
              // Se actualiza la tabla del modal y tambien la lista de baseline
              cargarDataJsGridBaseLine(Id_Ubicacion.value)
              cargarDataJsGridBaseLine()
            },
            error: function (err) {
              console.log(err);
            }
          });
        },
      },
      rowDoubleClick: function(args){
        dataFilasJsGridBaseLine = $("#jsGridBaseLine").jsGrid("option", "data");
        totalFIlasBaseLine = dataFilasJsGridBaseLine.length - 1;
        filaActualJsGridBaseLine = args.itemIndex;

        editarBaseLine()
      },
      // deleteConfirm: function(item){
      //   return `El registro será eliminado, ¿Esta seguro?`;
      // },
      fields: [
        { name: "numInspeccion", title:"No. Insp", type: "number",align:"center",},
        { name: "Fecha_Creacion", title:"Fecha", type: "text",align:"center",
          itemTemplate : function (value, item) {
            return new Date(value).toLocaleDateString();
          }
        },
        { name: "MTA", title: "MTA °C", type: "text",align:"center",},
        { name: "Temp_max", title: "Temp °C", type: "text",align:"center",},
        { name: "Temp_amb", title: "Amb °C", type: "text",align:"center",},
        { name: "Archivo_IR", title: "IR", type: "text",align:"center",},
        { name: "Archivo_ID", title: "ID", type: "text",align:"center",},
        { name: "Notas", title: "Notas", type: "text", css:"noWrap", width:210, align:"left",},
        { type: "control", modeSwitchButton: false, editButton: false, width:23,
          itemTemplate: function(value, item) {
            var btnEliminarItem = $("<button>")
            .click(function(e) {
              Swal.fire({
                title: 'Eliminar',
                html: `El registro será eliminado, ¿Esta seguro?`,
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  datos_base_line_filtro = datos_base_line_filtro.filter((bl) => bl.Id_Linea_Base != item.Id_Linea_Base);
                  JsGridBaseLine.jsGrid("deleteItem", item);
                }
              })
            });

            btnEliminarItem[0].classList.add("jsgrid-button");
            btnEliminarItem[0].classList.add("jsgrid-delete-button");
            btnEliminarItem[0].title = "Eliminar";
            btnEliminarItem[0].type = "button";

            return btnEliminarItem;
          }
        }
      ]

    });

  }

  function cargarDataJsGridBaseLine(ubicacionBL = ''){
    $.ajax({
      url: `inventarios/getHistorialBaseLine`,
      data: {Id_Ubicacion:ubicacionBL, Id_Inspeccion:idInspeccion},
      type: "POST",
      dataType: 'json',
      success: function (res) {
        if(ubicacionBL != ""){
          JsGridBaseLine.jsGrid("loadData",{ data : res});
        }else{
          JsGridListaBaseLine.jsGrid("loadData",{ data : res});
          // Datos para filtrar baseline por ubicacion del treeview
          datos_base_line_filtro = res;
          console.log(datos_base_line_filtro)
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function guardarDatosBaseLine(){
    if($("#FormBaseLine").valid()){
      // Obtenemos la operacion a realizar create ó update
      var form_action = $("#FormBaseLine").attr("action");
      // Guardamos el form con los input file para subir archivos
      var formData = new FormData(document.getElementById("FormBaseLine"));
      // formData.append('Id_Inspeccion',idInspeccion);
      // formData.append('Id_Ubicacion',Id_Ubicacion.value);

      $.ajax({
        data: formData,
        url: form_action,
        type: "POST",
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (res) {
          // creamos de nuevo el treeview actualizado
          cargar_datos_treeview().then(() => {
            ubicar_nodo()
          });
          // Se actualiza la tabla del modal y tambien la lista de baseline
          cargarDataJsGridBaseLine(Id_Ubicacion.value)
          cargarDataJsGridBaseLine()
          // Mostramos mensaje de operacion exitosa
          Toast.fire({
            icon: 'success',
            title: 'Agregado'
          })
          
          $('#modalBaseLine').modal('hide');
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
  };

  function validarFormBaseLine(){
    procesoValidacionBaseLine = $('#FormBaseLine').validate({
      rules: {
        MTA: {
          required: true,
          number:true
        },
        Temp_max: {
          required: true,
          number:true
        },
        Temp_amb: {
          required: true,
          number: true,
        },
        Archivo_IR: {
          required: true,
        },
        Archivo_ID:{
          required: true,
        },
      },
      messages: {
        MTA: {
          required: "Ingresar MTA",
          number: "Solo ingresar números",
        },
        Temp_max: {
          required: "Ingresar Temperatura máxima",
          number: "Solo ingresar números",
        },
        Temp_amb: {
          required: "Ingresar Temperatura Ambiente",
          number: "Solo ingresar números",
        },
        Archivo_IR: {
          required: "Agregar imagen térmica",
        },
        Archivo_ID:{
          required: "Agregar imagen digital",
        },
      },
      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.input-group').append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
      }
    });
  }

  function limpiarFrmBaseLine(){
    console.log('se cerro mdl')
    // Limpia los valores del form
    $('#FormBaseLine')[0].reset();
    // Quita los mensajes de error y limpia los valodes del form
    procesoValidacionBaseLine.resetForm();
    // Quita los estilos de error de los inputs
    $('#FormBaseLine').find(".is-invalid").removeClass("is-invalid");

    document.querySelector("#Id_InspeccionBL").value = idInspeccion;
    document.querySelector("#Id_UbicacionBL").value = Id_Ubicacion.value;

    document.querySelector("#imgIR_BL").src = "public/img/sistema/imagen-no-disponible.jpeg";
    document.querySelector("#imgID_BL").src = "public/img/sistema/imagen-no-disponible.jpeg";
    // OCultamos lo botones de navegacion dentre registros
    document.querySelector("#contenedorBtnNavegacionBL").style.display = "none"
    $(".datosImg").empty();
  }

  function cargarJsGridHistorialInspecciones(){
    // Creacion del jsGrid
    JsGridHistorialInspecciones = $("#jsGridHistorialInspecciones").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      selecting: true,
      paging: false,
      pageSize: 10,
      autoload: false,
      filtering: false,
      noDataContent: "Sin registros",

      controller: {
        loadData: function(filter){
          return filter.data
        },
      },
      fields: [
        { name: "numInspeccion", title:"No. Insp", type: "number",align:"center",},
        { name: "Fecha_Creacion", title:"Fecha", type: "text",align:"center",
          itemTemplate : function (value, item) {
            return new Date(value).toLocaleDateString();
          }
        },
        { name: "estatusUbicacion", title: "Estatus", type: "text",align:"center",},
        { name: "Notas_Inspeccion", title: "Notas", type: "text", css:"noWrap", width:210, align:"left",},
      ]

    });

  }

  function cargarDataJsGridHistorialInspecciones(ubicacionBL){
    $.ajax({
      url: `inventarios/getHistorialInspecciones/${ubicacionBL}`,
      type: "POST",
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (res) {
        JsGridHistorialInspecciones.jsGrid("loadData",{ data : res});
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function cargarDataSelectFallas(){
    // peticion a la base
    $.ajax({
      url: '/fallas/show',
      type: "get",
      // data:,
      dataType: 'json',
      success: function (data){
        dataSelectFallas = data;

        // crearSelectFallaProblemas('0D32B333-76C3-11D3-82BF-00104BC75DC2',"hazard_Type");
        // crearSelectFallaProblemas('0D32B333-76C3-11D3-82BF-00104BC75DC2',"hazard_Classification");
        // crearSelectFallaProblemas('0D32B333-76C3-11D3-82BF-00104BC75DC2',"hazard_Group");
        crearSelectFallaProblemas('0D32B333-76C3-11D3-82BF-00104BC75DC2',"hazard_Issue");
      },
      error: function (error) {
        console.log(error);
      },
    });

  }
  
  function crearSelectFallaProblemas(tipoProblema,id_select){
    // obteniendo el select a modificar
    var select = document.getElementById(`${id_select}`);
    // // Limpiando el select
    $(`#${id_select}`).empty();

    newdata = dataSelectFallas.filter(falla => falla.tipoProblmea == tipoProblema);

    // creando el select con los productos en la OC
    select.innerHTML += '<option value="">Selecionar...</option>';
    newdata.forEach(newdata => {
      select.innerHTML += `<option value="${newdata.Id_Falla}">${newdata.Falla}</option>`;            
    });
  }

  function lastImg(event){
    // peticion a la base
    $.ajax({
      url: '/inventarios/lastImg',
      type: "post",
      dataType: 'json',
      data:{Id_Inspeccion: idInspeccion},
      success: function (data){
        var inputImg = event.target.previousElementSibling.previousElementSibling;
        console.log(inputImg)
        if(inputImg.classList.contains('inputIR')) {
          inputImg.value = data.irImg;
        }else{
          inputImg.value = data.digImg;
        }
        
        event.target.previousElementSibling.firstElementChild.click()
      },
      error: function (error) {
        console.log(error);
      },
    });

  }

  function calcularImg(event){
    var inputImg, index1, num, numDigitos, index2, iniciales, ext, btnClick, rellenar = false;

    if(event.target.classList.contains('fas')) {
      inputImg = event.target.parentElement.parentElement.previousElementSibling;
      btnClick = event.target.parentElement;
    }else{
      inputImg = event.target.parentElement.previousElementSibling;
      btnClick = event.target;
    }

    if(inputImg.value == ""){
      return;
    }

    var str = inputImg.value.split('');
    for (let i = 0; i < str.length; i++) {
      if(str[i] >=0 || str[i] <= 9){
        index1 = i;
        if(str[i] == 0){
          rellenar = true;
        }
        break;
      }
    }
    
    index2 = inputImg.value.indexOf(".");
    
    // Cortar desde 0 hasta que termine
    iniciales = inputImg.value.substring(0, index1);
    num = inputImg.value.substring(index1,index2);
    numDigitos = num.length;
    ext = inputImg.value.substring(index2);

    if(btnClick.classList.contains('btnUp')) {
      num = (parseInt(num) + 1);
    }else{
      num = (parseInt(num) - 1);
    }
    
    if(rellenar){
      num = rellenarString(num,numDigitos);
    }
    
    inputImg.value = `${iniciales}${num}${ext}`;
  }

  function guardarArchivosIMG(){
    
    if (document.querySelector("#imagenes").value == "") {
      Toast.fire({
        icon: 'error',
        title: 'Seleccionar imágenes'
      })
      return;
    }

    // Obtenemos la operacion a realizar
    var form_action = $("#FormArchivosImg").attr("action");
    // Guardamos el form con los input file para subir archivos
    var formData = new FormData(document.getElementById("FormArchivosImg"));
    formData.append('Id_Inspeccion',idInspeccion);

    $.ajax({
      data: formData,
      url: form_action,
      type: "POST",
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (res) {
        console.log(res);
        document.querySelector("#imagenes").value = "";
        explorarArchivos();
        Toast.fire({
          icon: 'success',
          title: 'Agregado'
        })
      },
      error: function (err) {
        console.log(err);
      }
    });

  };

  function explorarArchivos(){
    if (numInspeccionArchivos.value == "") {
      return
    }
    $.ajax({
      url: '/inventarios/explorarArchivos',
      data: {numInspeccionArchivos: numInspeccionArchivos.value},
      type: "POST",
      dataType: 'json',
      success: function (data) {
        let contenedorExplorador = document.querySelector("#exploradorArchivos");
        // limpianos el div
        contenedorExplorador.innerHTML = '';

        const ui = document.createElement("ul");
        ui.id = "listaImg";

        data.forEach(nombreImg => {
          let li = document.createElement("li");
          li.classList.add("listExploradorArchivos");

          let checkbox = document.createElement('input');
          checkbox.type = "checkbox";
          checkbox.id = `${nombreImg}`;
          checkbox.value = `${nombreImg}`;
          checkbox.name= "arrayImgSelec[]";
          checkbox.classList.add("checkBoxImg");
  
          let label = document.createElement('label');
          label.htmlFor = `${nombreImg}`;
          label.classList.add("labelImg");
  
          let img = document.createElement('img');
          img.src = `public/Archivos_ETIC/inspecciones/${numInspeccionArchivos.value}/Imagenes/${nombreImg}`;
          
          let titulo = document.createElement('div');
          titulo.style.cssText += 'font-weight: normal; font-size:14px';
          titulo.innerHTML = `${nombreImg}`;

          label.appendChild(img);
          label.appendChild(titulo);
          li.appendChild(checkbox);
          li.appendChild(label);
          ui.appendChild(li)

        })

        contenedorExplorador.appendChild(ui)

      },
      error: function (err) {
        console.log(err);
      }
    });
  };

  function eliminarImg(){

    var imgSeleccionadas = [];
    $('input[type=checkbox][name="arrayImgSelec[]"]:checked').each(function() {
      imgSeleccionadas.push($(this).val());
    });

    if(imgSeleccionadas != ""){
      Swal.fire({
        title: 'Confirmar eliminación',
        text: "Las imágenes se eliminarán permanentemente",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          var datosArreglo = JSON.stringify({imgSeleccionadas });
          $.ajax({
            data: {datosArreglo, numInspeccionArchivos: numInspeccionArchivos.value, Id_Inspeccion: idInspeccion},
            url: "/inventarios/eliminarImagenes",
            type: "POST",
            dataType: 'json',
            success: function (res) {        
              explorarArchivos();
              Toast.fire({
                icon: 'success',
                title: 'Eliminados'
              })
            },
            error: function (err) {
              console.log(err);
            }
          });
        }
      })
    }else{
      Toast.fire({
        icon: 'warning',
        title: 'Seleccionar Imágenes'
      })
    }
  }

  function seleccionarImagen(){
    var imgSeleccionadas = [];
    $('input[type=checkbox][name="arrayImgSelec[]"]:checked').each(function() {
      imgSeleccionadas.push($(this).val());
    });

    if(imgSeleccionadas.length != 1){
      Toast.fire({
        icon: 'warning',
        title: 'Seleccionar 1 Imágen'
      })
    }else{
      inputImgStr.value = imgSeleccionadas[0];
      contenedorImgSeleccionado.click();
      $('#modalFileExplorer').modal('hide');
      inputImgStr = "";
    }
  }

  function limpiarCheckBoxImg(){
    $('input[type=checkbox][name="arrayImgSelec[]"]:checked').each(function(checkBox) {
      checkBox = $(this)[0];
      checkBox.checked = false;
    });
  }

  function ubicarTextImg(event){
    console.log("identificando quien fue")
    if(event.target.classList.contains('fas')) {
      console.log("icono")
      inputImgStr = event.target.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
    }else{
      console.log("boton")
      inputImgStr = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
    }
    console.log(inputImgStr)
  }

  function datosImg(elemento, nombreImg, idInspeccionImg = idInspeccion, numInspeccionImg = strNumInspeccion.value){
    elemento.nextElementSibling.innerHTML = "";
    let rutaImg= `public/Archivos_ETIC/inspecciones/${numInspeccionImg}/Imagenes/${nombreImg}`;
    console.log(rutaImg)
    elemento.src = rutaImg;

    $.ajax({
      url: 'inventarios/obtenerDatosImg',
      data: {ruta: rutaImg},
      type: "POST",
      dataType: 'json',
      success: function (res) {
        elemento.nextElementSibling.innerHTML = `
        <strong>Fecha:</strong><span> ${res.fecha}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <strong>Hora:</strong><span> ${res.hora}</span>`;
      },
      error: function (){
        elemento.nextElementSibling.innerHTML = `
        <strong>Fecha:</strong><span> --/--/----</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <strong>Hora:</strong><span> --:-- --</span>`;
      }
    });

  }
  
  function cambiarEstatusUbicacion(idUbicacionDet){
    
    console.log(selectEstatus.value)
    console.log(idUbicacionDet)

    if(selectEstatus.value == ""){
      limpiarChecksEstatus()

      Toast.fire({
        icon: 'warning',
        title: 'Seleccionar estatus'
      })

      return;
    }
    var textEstatus = $('select[name="Id_Status_Inspeccion_Det"] option:selected').text();
    textEstatus = textEstatus.split(" ",1);

    $.ajax({
      url: `/inventarios/cambiarEstatusUbicacion`,
      type: "POST",
      dataType: 'json',
      data:{Id_Inspeccion_Det: idUbicacionDet,idEstatus:selectEstatus.value},
      success: function (data){

        rowJsGridInventario.innerHTML= textEstatus[0];
      },
      error: function (error) {
        console.log(error);
      },
    });

  }

  function checkedJsGrid(event){
    if(event.target.classList.contains('checkBoxEstatusJsGrid') && event.target.checked){
      rowJsGridInventario = event.target.parentElement.parentElement.nextSibling.nextSibling;
      cambiarEstatusUbicacion(event.target.value);
    }
  }

  function cargarJsGridListaBaseLine(){
    // Creacion del jsGrid
    JsGridListaBaseLine = $("#jsGridListaBaseLine").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      selecting: true,
      paging: false,
      pageSize: 10,
      autoload: false,
      filtering: false,
      noDataContent: "Sin registros",
      confirmDeleting: false,

      controller: {
        loadData: function(filter){
          return filter.data
        },
        deleteItem: function(item) {
          return $.ajax({
            url: "/inventarios/eliminarBaseLine/"+item.Id_Linea_Base,
            dataType: 'json',
            success: function (res) {

              // creamos de nuevo el treeview actualizado
              cargar_datos_treeview().then(() => {
                ubicar_nodo()
              });
              // Mostramos mensaje de operacion exitosa
              Toast.fire({
                icon: 'success',
                title: 'Eliminado'
              })
              // actualizamos el listado BL
              cargarDataJsGridBaseLine();
            },
            error: function (err) {
              console.log(err);
            }
          });
        },
      },
      rowDoubleClick: function(args){
        dataFilasJsGridBaseLine = $("#jsGridListaBaseLine").jsGrid("option", "data");
        totalFIlasBaseLine = dataFilasJsGridBaseLine.length - 1;
        filaActualJsGridBaseLine = args.itemIndex;
        // Mostramos los botones de navegacion entre registros
        document.querySelector("#contenedorBtnNavegacionBL").style.display = ""

        editarBaseLine()
      },
      // deleteConfirm: function(item){
      //   return `El registro será eliminado, ¿Esta seguro?`;
      // },
      fields: [
        { name: "numInspeccion", title:"No. Insp", type: "number", align:"center",},
        { name: "equipo", title:"Equipo", type: "text", width:150, align:"",},
        { name: "Fecha_Creacion_sinFormato", title:"Fecha", type: "text",align:"center",
          itemTemplate : function (value, item) {
            return new Date(value).toLocaleDateString();
          }
        },
        { name: "MTA", title: "MTA °C", type: "text",align:"center",},
        { name: "Temp_max", title: "Temp °C", type: "text",align:"center",},
        { name: "Temp_amb", title: "Amb °C", type: "text",align:"center",},
        { name: "Archivo_IR", title: "IR", type: "text",align:"center",},
        { name: "Archivo_ID", title: "ID", type: "text",align:"center",},
        { name: "Notas", title: "Notas", type: "text", css:"noWrap", width:210, align:"left",},
        { type: "control", modeSwitchButton: false, editButton: false, width:23,
          itemTemplate: function(value, item) {
            var btnEliminarItem = $("<button>")
            .click(function(e) {
              Swal.fire({
                title: 'Eliminar',
                html: `El registro será eliminado, ¿Esta seguro?`,
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  datos_base_line_filtro = datos_base_line_filtro.filter((bl) => bl.Id_Linea_Base != item.Id_Linea_Base);
                  JsGridListaBaseLine.jsGrid("deleteItem", item);
                }
              })
            });

            btnEliminarItem[0].classList.add("jsgrid-button");
            btnEliminarItem[0].classList.add("jsgrid-delete-button");
            btnEliminarItem[0].title = "Eliminar";
            btnEliminarItem[0].type = "button";

            return btnEliminarItem;
          }
        }
      ]

    });

  }

  function editarBaseLine(){
    
    let idinspeccioneBl = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Id_Inspeccion;
    let numInspeccionBl = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].numInspeccion;
    let imgIrBl = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Archivo_IR;
    let imgDigBl = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Archivo_ID;
    
    document.querySelector("#Id_Linea_Base").value = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Id_Linea_Base;
    document.querySelector("#Id_InspeccionBL").value = idinspeccioneBl;
    document.querySelector("#Id_UbicacionBL").value = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Id_Ubicacion;
    document.querySelector("#MTA").value = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].MTA;
    document.querySelector("#Temp_max").value = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Temp_max;
    document.querySelector("#Temp_amb").value = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Temp_amb;
    document.querySelector("#Archivo_IR").value = imgIrBl;
    document.querySelector("#Archivo_ID").value = imgDigBl;
    document.querySelector("#NotasBL").value = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Notas;
    document.querySelector("#imgIR_BL").src = `public/Archivos_ETIC/inspecciones/${dataFilasJsGridBaseLine[filaActualJsGridBaseLine].numInspeccion}/Imagenes/${dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Archivo_IR}`
    document.querySelector("#imgID_BL").src = `public/Archivos_ETIC/inspecciones/${dataFilasJsGridBaseLine[filaActualJsGridBaseLine].numInspeccion}/Imagenes/${dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Archivo_ID}`
    datosImg(document.querySelector("#imgIR_BL"), imgIrBl, idinspeccioneBl, numInspeccionBl);
    datosImg(document.querySelector("#imgID_BL"), imgDigBl, idinspeccioneBl, numInspeccionBl);
    document.querySelector("#rutaBaseLine").value = dataFilasJsGridBaseLine[filaActualJsGridBaseLine].Ruta;;

    $('#modalBaseLine').modal('show');
  }

  function navegacionListaBaseLine(event){
    if(event.target.classList.contains('fas')) {
      btnClick = event.target.parentElement;
    }else{
      btnClick = event.target;
    }

    if(btnClick.id == "btnSiguiente" && filaActualJsGridBaseLine < totalFIlasBaseLine) {
      filaActualJsGridBaseLine = filaActualJsGridBaseLine + 1;
    }else if(btnClick.id == "btnAtras" && filaActualJsGridBaseLine > 0){
      filaActualJsGridBaseLine = filaActualJsGridBaseLine - 1;
    }
    editarBaseLine();
  }

  function navegacionListaProblemas(event){
    if(event.target.classList.contains('fas')) {
      btnClick = event.target.parentElement;
    }else{
      btnClick = event.target;
    }
    
    if(btnClick.id == "btnSiguienteProblemas" && filaActualJsGridProblemas < totalFIlasProblemas) {
      filaActualJsGridProblemas = filaActualJsGridProblemas + 1;
    }else if(btnClick.id == "btnAtrasProblemas" && filaActualJsGridProblemas > 0){
      filaActualJsGridProblemas = filaActualJsGridProblemas - 1;
    }
    ajustesEditarProblema();
  }

  function seleccionarElementosReporte(id_elemento, tipo_reporte){
    
    document.querySelector("#contenedor_lista_ri").innerHTML = "";
    document.querySelector("#contenedor_lista_ra").innerHTML = "";
    
    let contenedorElementos = document.querySelector(`#${id_elemento}`);
    // contenedorElementos.innerHTML = "";
    
    datos_treeview_iniciales.forEach(elemento => {
      arrayIdElementos= []
      let contenedorCheck = document.createElement('div');
      contenedorCheck.classList.add("form-check");

      let inputCheck = document.createElement('input');
      inputCheck.type = "checkbox";
      inputCheck.id = `${elemento.Id_Inspeccion_Det}`;
      inputCheck.value = obtenerIdElementos(elemento);
      inputCheck.name= "arrayElementosSeleccionados[]";
      inputCheck.classList.add("form-check-input");

      let label = document.createElement('label');
      label.htmlFor = `${elemento.Id_Inspeccion_Det}`;
      label.innerHTML = `${elemento.name}`;
      label.classList.add("form-check-label");

      contenedorCheck.appendChild(inputCheck);
      contenedorCheck.appendChild(label);
      contenedorElementos.appendChild(contenedorCheck);

    })

    if(tipo_reporte == 1){
      $('#modalSeleccionarElementosPdf').modal('show');
    }
  }

  function seleccionarProblemasReporte(id_elemento, tipo_reporte){

    document.querySelector("#tablaProblemasPdf_ri").innerHTML = "";
    document.querySelector("#tablaProblemasPdf_ra").innerHTML = "";
    
    var cuerpoTabla = document.querySelector(`#${id_elemento}`);

    let problemasActuales = [];
    let problemasActuales_ordenados = [];
    
    // Obteniendo todos los problemas abiertos de la inspeccion actual
    // problemasActuales = dataGridProblemas.filter(problema => problema.Estatus_Problema == "Abierto" && problema.Id_Inspeccion == idInspeccion);
    // modificacion para problemas abeirtos y cerrados
    problemasActuales = dataGridProblemas.filter(problema => problema.Id_Inspeccion == idInspeccion);
    
    // problemasActuales.sort((a, b) => a.Id_Tipo_Inspeccion - b.Id_Tipo_Inspeccion);
    // problemasActuales.sort((a, b) => a.Numero_Problema - b.Numero_Problema);

    // Obteniedno solo los problemas electricos
    // Antes del proceso DB
    // problemas_electricos = problemasActuales.filter(problema => problema.Id_Tipo_Inspeccion == 1);
    problemas_electricos = problemasActuales.filter(problema => problema.Id_Tipo_Inspeccion == "0D32B331-76C3-11D3-82BF-00104BC75DC2" || problema.Id_Tipo_Inspeccion == "0D32B332-76C3-11D3-82BF-00104BC75DC2");
    // Ordenando problemas electricos por numero de problema
    problemas_electricos.sort((a, b) => a.Numero_Problema - b.Numero_Problema);
    
    // Obteniedno solo los problemas mecanicos
    // Antes del proceso DB
    // problemas_mecanicos = problemasActuales.filter(problema => problema.Id_Tipo_Inspeccion == 4);
    problemas_mecanicos = problemasActuales.filter(problema => problema.Id_Tipo_Inspeccion == "0D32B334-76C3-11D3-82BF-00104BC75DC2");
    // Ordenando problemas mecanicos por numero de problema
    problemas_mecanicos.sort((a, b) => a.Numero_Problema - b.Numero_Problema);

    // Obteniedno solo los problemas visuales
    // Antes del proceso DB
    // problemas_visuales = problemasActuales.filter(problema => problema.Id_Tipo_Inspeccion == 3);
    problemas_visuales = problemasActuales.filter(problema => problema.Id_Tipo_Inspeccion == "0D32B333-76C3-11D3-82BF-00104BC75DC2");
    // Ordenando problemas visuales por numero de problema
    problemas_visuales.sort((a, b) => a.Numero_Problema - b.Numero_Problema);

    // Concatenando los problemas ordenados 
    problemasActuales_ordenados = problemasActuales_ordenados.concat(problemas_electricos, problemas_mecanicos, problemas_visuales);

    // Limpiando la tabla
    cuerpoTabla.innerHTML = "";

    problemasActuales_ordenados.forEach(element => {
      cuerpoTabla.innerHTML += `<tr>
                                  <td>
                                    <input type="checkbox" id="${element.Id_Problema}" value="${element.Id_Problema}" name="arrayProblemasSeleccionados[]">
                                  </td>
                                  <td><label for="${element.Id_Problema}" class="form-check-label">${element.tipoInspeccion} ${element.Numero_Problema}</label></td>
                                  <td colspan="2"><label for="${element.Id_Problema}" class="form-check-label">${element.nombreEquipo}</label></td>
                                </tr>`;
    });
    
    if(tipo_reporte == 1){
      $('#modalSeleccionarProblemasPdf').modal('show');
    }
  }

  function obtenerDatosReporteInventariosPdf(tipo_reporte = ""){
    return new Promise((resolve, reject) => {
      let elementosSeleccionadosReporte = [];
      $('input[type=checkbox][name="arrayElementosSeleccionados[]"]:checked').each(function() {
        elementosSeleccionadosReporte.push($(this).val());
      });

      if(elementosSeleccionadosReporte.length < 1){
        Toast.fire({
          icon: 'warning',
          title: 'Seleccionar ubicaciones'
        })
        return
      }

      let arrayElementosParaReporte =[];
      elementosSeleccionadosReporte.forEach(elemento =>{
        let strElemento = elemento.split(",")
        strElemento.forEach(idElementos =>{
          arrayElementosParaReporte.push(idElementos);
        })
        
      })

      let datosArreglo = JSON.stringify({arrayElementosParaReporte});
      $.ajax({
        data: {datosArreglo},
        url: "/inventarios/generarReporteInventarios",
        type: "POST",
        dataType: 'json',
        success: function (res) {
          
          if(tipo_reporte == "individual"){

            Toast.fire({
              icon: 'success',
              title: 'Reporte generado'
            })

            setTimeout(() => {
              $("#modalSeleccionarElementosPdf").modal("hide");
            }, 850);

          }
          // window.open(`/inventarios/generarReporteInventarios`);
          resolve('succes');
        },
        error: function (error) {
          reject(error)
        },
      });
    })
  }

  function obtenerDatosReporteProblemasPdf(tipo_reporte = ""){
    return new Promise((resolve, reject) => {
      let arrayElementosParaReporte = [];
      $('input[type=checkbox][name="arrayProblemasSeleccionados[]"]:checked').each(function() {
        arrayElementosParaReporte.push($(this).val());
      });

      if(arrayElementosParaReporte.length < 1){
        Toast.fire({
          icon: 'warning',
          title: 'Seleccionar Problemas'
        })
        return
      }

      let datosArreglo = JSON.stringify({arrayElementosParaReporte});
      $.ajax({
        data: {datosArreglo},
        url: "/inventarios/generarReporteProblemas",
        type: "POST",
        dataType: 'json',
        success: function (res) {

          if(tipo_reporte == "individual"){
            
            Toast.fire({
              icon: 'success',
              title: 'Reporte generado'
            })

            setTimeout(() => {
              $("#modalSeleccionarProblemasPdf").modal("hide");
            }, 850);

          }
          // window.open(`/inventarios/generarReporteProblemas`);
          resolve('succes');
        },
        error: function (error) {
          reject(error)
        },
      });
    });
  }
  
  function obtenerIdElementos(element){
    arrayIdElementos.push(element.Id_Inspeccion_Det)
    if(element.nodes != null){
      var nodoElemento = element.nodes
      nodoElemento.forEach(nodo =>{
        obtenerIdElementos(nodo)
      })
    }
    return arrayIdElementos;
  }

  function check(event) {
    
    let btnCheck = event.target;
    if(!event.target.classList.contains('btn')) {
      btnCheck = event.target.parentElement;
    }
    
    let check = btnCheck.value != "true"
    let checkboxes = [];

    if(btnCheck.classList.contains('inventario') ) {
      checkboxes = document.querySelectorAll('input[name="arrayElementosSeleccionados[]"]');
    }else{
      checkboxes = document.querySelectorAll('input[name="arrayProblemasSeleccionados[]"]');
    }
    
    checkboxes.forEach((checkbox) => {
      checkbox.checked =  check;
    });

    btnCheck.value = btnCheck.value == "false" ? "true" : "false";
  }

  function reporteListaProblemas(estatus,tipo_reporte = ""){

    $.ajax({
      url: `/inventarios/generarReporteListaProblemas/${estatus}`,
      type: "POST",
      dataType: 'json',
      success: function (res) {

        if(tipo_reporte == "individual"){
          
          Toast.fire({
            icon: 'success',
            title: 'Reporte generado'
          })
        }
      }
    });

    // window.open(`/inventarios/generarReporteListaProblemas/${estatus}`);
  }

  function infoReporteResultadoAnalisis(){
    seleccionarElementosReporte("contenedor_lista_ra",2);
    seleccionarProblemasReporte("tablaProblemasPdf_ra",2);
    $('#modalInfoReporteResultadoAnalisis').modal('show');
  }

  // Cargar contactos en el modal para el reporte word
  function cargarContactos(){

    // peticion a la base
    $.ajax({
      url: `/sitios/show/${idSitio}`,
      type: "get",
      data:'',
      dataType: 'json',
      success: function (data){
        console.log(data)

        // Estructurando nomnre del archivo para exportar al finalizar la inspeccion
        let nombre_cliente = data[0].nombreCliente.replaceAll(" ","")
        let nombre_sitio = data[0].Sitio.replaceAll(" ","")
        nombre_archivo_inspeccion = `ETIC_${strNumInspeccion.value}_${nombre_cliente}_${nombre_sitio}.sql`;

        nombre_contacto_1.value = data[0].Contacto_1;
        puesto_contacto_1.value = data[0].Puesto_Contacto_1;
        
        nombre_contacto_2.value = data[0].Contacto_2;
        puesto_contacto_2.value = data[0].Puesto_Contacto_2;
        
        nombre_contacto_3.value = data[0].Contacto_3;
        puesto_contacto_3.value = data[0].Puesto_Contacto_3;
        
        // arrayContactosSitio = [...arrayContactosSitio, contacto1, contacto2, contacto3];
        
        // insertarContactos(arrayContactosSitio);

      },
      error: function (error) {
        console.log(error);
      },
    });

  }

  function limpiarCampoContacto(event){
    let numInput = event.target.id;

    document.querySelector(`#nombre_contacto_${numInput}`).value = "";
    document.querySelector(`#puesto_contacto_${numInput}`).value = "";

  }

  function camposReporeteResultados(event){
    console.log(event.target)
    let elemento_click_RA = event.target;
    let contenedorElementosRA = event.target.parentElement.previousElementSibling;
    console.log(contenedorElementosRA)

    // console.log(contenedorElementosRA)

    let div_contenedor = document.createElement('div');
    div_contenedor.classList.add("input-group","input-group-sm","mt-1");

    switch (true) {
      case elemento_click_RA.classList.contains("agregar_descripcion"):
        div_contenedor.innerHTML = "";
        div_contenedor.innerHTML = `
          <textarea class="form-control form-control-sm" id=""
          name="descripcion_reporte[]" placeholder="Ingresa la descripción" rows="2"></textarea>
          <div class="d-flex align-items-center p-1">
            <i class="fas fa-trash-alt btnCamposReporte eliminar" style="color:red; cursor: pointer;"></i>
          </div>
        `;

        contenedorElementosRA.appendChild(div_contenedor);
      break;
      case elemento_click_RA.classList.contains("agregar_recomendacion"):
        let div_contenedor_recomendaciones = document.createElement('div');
        div_contenedor_recomendaciones.innerHTML = "";
        div_contenedor.innerHTML += `
          <textarea class="form-control form-control-sm" id=""
          name="recomendacion_reporte[]" placeholder="Ingresa la descripción" rows="2"></textarea>
          <div class="d-flex align-items-center p-1">
            <i class="fas fa-trash-alt btnCamposReporte eliminar recomendacion" style="color:red; cursor: pointer;"></i>
          </div>
        `;
        
        let div_contenedor_img = document.createElement('div');
        div_contenedor_img.classList.add("row");
        div_contenedor_img.innerHTML = `
          <div class="col-sm-5 mt-1">
              <div class="input-group input-group-sm" style="" id="">
                  <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion[]" id="" placeholder="Nombre archivo">
                  <div class="btn-group-vertical btn-group-sm">
                      <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                          class="btn btn-default btn-sm rounded-0 btnUp">
                          <i class="fas fa-chevron-up"></i>
                      </button>
                      <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                          class="btn btn-default btn-sm rounded-0 btnDown">
                          <i class="fas fa-chevron-down"></i>
                      </button>
                  </div>
                  <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
                  <div class="input-group-prepend">
                      <button class="btn btn-info btn-sm btnModalArchivos_recomendacion" type="button" data-toggle="modal"
                          data-target="#modalFileExplorer">
                          <i class="fas fa-folder-open fa-xs"></i>
                      </button>
                  </div>
              </div>
          </div>
          <div class="col-sm-5 mt-1">
            <div class="input-group input-group-sm" style="" id="">
                <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion_2[]" id="" placeholder="Nombre archivo">
                <div class="btn-group-vertical btn-group-sm">
                    <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                        class="btn btn-default btn-sm rounded-0 btnUp">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                        class="btn btn-default btn-sm rounded-0 btnDown">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
                <div class="input-group-prepend">
                    <button class="btn btn-info btn-sm btnModalArchivos_recomendacion" type="button" data-toggle="modal"
                        data-target="#modalFileExplorer">
                        <i class="fas fa-folder-open fa-xs"></i>
                    </button>
                </div>
            </div>
          </div>
        `;

        div_contenedor_recomendaciones.appendChild(div_contenedor);
        div_contenedor_recomendaciones.appendChild(div_contenedor_img);
        contenedorElementosRA.appendChild(div_contenedor_recomendaciones);
      break;
      case elemento_click_RA.classList.contains("agregar_area"):
        div_contenedor.innerHTML = "";
        div_contenedor.innerHTML += `
          <textarea class="form-control form-control-sm" id=""
          name="areas_inspeccionadas[]" placeholder="Ingresa la descripción" rows="2"></textarea>
          <div class="d-flex align-items-center p-1">
            <i class="fas fa-trash-alt btnCamposReporte eliminar" style="color:red; cursor: pointer;"></i>
          </div>
        `;

        contenedorElementosRA.appendChild(div_contenedor);
      break;
      case elemento_click_RA.classList.contains("agregar_referencia"):
        div_contenedor.innerHTML = "";
        div_contenedor.innerHTML = `
          <textarea class="form-control form-control-sm" id=""
          name="referencia_reporte[]" placeholder="Ingresa la referencia" rows="1"></textarea>
          <div class="d-flex align-items-center p-1">
            <i class="fas fa-trash-alt btnCamposReporte eliminar" style="color:red; cursor: pointer;"></i>
          </div>
        `;

        contenedorElementosRA.appendChild(div_contenedor);
      break;
      case elemento_click_RA.classList.contains("eliminar"):

        if(elemento_click_RA.classList.contains("recomendacion")){
          elemento_click_RA.parentElement.parentElement.parentElement.remove();
        }else{
          elemento_click_RA.parentElement.parentElement.remove();
        }

      break;
      case elemento_click_RA.classList.contains("limpiar"):
        
        if(elemento_click_RA.classList.contains("recomendacion")){
          elemento_click_RA.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.value = "";
          elemento_click_RA.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.value = "";
        }

        elemento_click_RA.parentElement.previousElementSibling.value = "";
      break;
      case elemento_click_RA.classList.contains("btnModalArchivos_recomendacion") || elemento_click_RA.classList.contains("fa-folder-open"):
        console.log("entro acaa")
        ubicarTextImg(event)
      break;
    }
  }

  // Mostrar los contactos en el modal para el archivo word
  function insertarContactos(contactos){
    // obteniendo el contenedor a modificar
    var contenedorContactos = document.getElementById(`contenedorContactos`);
    // Limpiando el contenedorContactos
    contenedorContactos.innerHTML = "";

    console.log(contactos)

    contactos.forEach(contacto => {
      contenedorContactos.innerHTML += `<div class="row mb-1">
        <div class="col-sm-6">
          <div class="input-group input-group-sm">
            <input type="text" class="form-control" id="" name="nombre_contacto[]" placeholder="Nombre" value="${contacto.nombre}">
          </div>
        </div>
        
        <div class="col-sm-6">
          <div class="input-group input-group-sm">
            <input type="text" class="form-control form-control-sm" id="" name="puesto_contacto[]" placeholder="Gerente de Planta" value="${contacto.puesto}">
            <div class="d-flex align-items-center p-1">
                <i class="fas fa-undo-alt" style="color:red; cursor: pointer;"></i>
            </div>
          </div>
        </div>
      </div>`;
    });

  }

  function validarFormInfoReporteResultadoAnalisis(){
    procesoValidacionResultadosAnalisis= $('#FrmInfoReporteResultadoAnalisis').validate({
      ignore: "",
      rules: {
        nombre_img_portada: {required: true},
        "nombre_contacto[]": {required: true},
        "puesto_contacto[]": {required: true},
        "descripcion_reporte[]": {required: false},
        "areas_inspeccionadas[]": {required: true},
        "recomendacion_reporte[]": {required: true},
        "referencia_reporte[]": {required: true},
        fecha_inicio_ra: {required: true},
        fecha_fin_ra: {required: true},
        "arrayElementosSeleccionados[]": {required: true},
        "arrayProblemasSeleccionados[]": {required: true},
      },
      messages: {
        nombre_img_portada: {required: "Seleccionar portada"},
        "nombre_contacto[]": {required: "Ingresar nombre del contacto"},
        "puesto_contacto[]": {required: "Ingresar puesto del contacto"},
        "descripcion_reporte[]": {required: "Ingresar descripción"},
        "areas_inspeccionadas[]": {required: "Ingresar las áreas/equipos inspeccionados"},
        "recomendacion_reporte[]": {required: "Ingresar recomendaciones"},
        "referencia_reporte[]": {required: "Ingresar referencia"},
        fecha_inicio_ra: {required: "Ingresar fecha"},
        fecha_fin_ra: {required: "Ingresar fecha"},
        "arrayElementosSeleccionados[]": {required: function(){
          Toast.fire({
            icon: 'warning',
            title: 'Seleccionar al menos 1 ubicación'
          })
        }},
        "arrayProblemasSeleccionados[]": {required: function(){
          Toast.fire({
            icon: 'warning',
            title: 'Seleccionar al menos 1 problema'
          })
        }},
      },
      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.input-group').append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
      }
    });
  }

  function generarReporteResultadoAnalisis(){
    // window.open(`/inventarios/datosResultadoDeAnalisis`);
    if($("#FrmInfoReporteResultadoAnalisis").valid()){
      console.log("entrando ala generacion")
      onlyClick(btnGenerarReporteAnalisis)

      alertLodading("Creando Reporte..","info",2500)
      

      // Obtenemos la operacion a realizar create ó update
      var form_action = $("#FrmInfoReporteResultadoAnalisis").attr("action");
      // Guardamos el form con los input file para subir archivos
      var formData = new FormData(document.getElementById("FrmInfoReporteResultadoAnalisis"));

      // Guardando los datos del reporte en la BD
      fetch('/inventarios/guardar_datos_reporte', {
        method: 'POST',
        body: formData
      }).then(function(response) {
        if(response.ok) {
          return response.text()
        } else {
          throw "Error en la llamada Ajax";
        }
      })
      
      // generarReporteBaseLine().then(() => {
      //   return obtenerDatosReporteInventariosPdf().then(() => {
      //     return obtenerDatosReporteProblemasPdf()
      //   })
      // });

      generarReporteBaseLine().then(() => {
        return obtenerDatosReporteInventariosPdf()
      }).then(() => {
        return obtenerDatosReporteProblemasPdf()
      }).then(() => {
        $.ajax({
          data: formData,
          url: form_action,
          type: "POST",
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (res) {
            cerrarAlertLoading("Reporte generado!")
            
            setTimeout(() => {
              $('#modalInfoReporteResultadoAnalisis').modal('hide');
            }, 850);
          },
          error: function (err) {
            console.log(err)
            cerrarAlertLoading("Error al generar el reporte")
          }
        });
      });
    }
  }

  function limpiarFrmResultadoAnalisis(){
    // Limpia los valores del form
    $('#FrmInfoReporteResultadoAnalisis')[0].reset();
    // Quita los mensajes de error y limpia los valodes del form
    procesoValidacionResultadosAnalisis.resetForm();
    // Quita los estilos de error de los inputs
    $('#FrmInfoReporteResultadoAnalisis').find(".is-invalid").removeClass("is-invalid");

    $("#contenedorDescripciones , #contenedorRecomendaciones, #contenedorAreas").empty();

    document.querySelector("#img_portada").src = "public/img/sistema/imagen-no-disponible.jpeg";

    $(".datosImg").empty();
    cargarContactos();

    document.querySelector("#contenedorTabrecomendaciones").innerHTML=``;
    document.querySelector("#contenedorTabrecomendaciones").innerHTML = `
      <div>
        <!-- RECOMENDACION -->
        <div class="input-group input-group-sm mt-1">
          <textarea class="form-control form-control-sm" id="recomendacion_reporte" name="recomendacion_reporte[]" placeholder="Ingresa la recomendación" rows="2">
            Realizar un plan inmediato para ejecutar las reparaciones de acuerdo a la clasificación de diferencial de temperatura reportado.
          </textarea>
          <div class="d-flex align-items-center p-1">
            <i class="fas fa-undo-alt btnCamposReporte limpiar recomendacion" style="color:red; cursor: pointer;"></i>
          </div>
        </div>
        <!-- IMAGEN RECOMENDACION -->
        <div class="row">
          <div class="col-sm-5 mt-1">
            <div class="input-group input-group-sm" style="" id="">
              <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion[]" id="" placeholder="Nombre archivo">
              <div class="btn-group-vertical btn-group-sm">
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnUp">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnDown">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
              <div class="input-group-prepend">
                <button class="btn btn-info btn-sm btnModalArchivos" type="button" data-toggle="modal" data-target="#modalFileExplorer">
                  <i class="fas fa-folder-open fa-xs"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-5 mt-1">
            <div class="input-group input-group-sm" style="" id="">
              <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion_2[]" id="" placeholder="Nombre archivo">
              <div class="btn-group-vertical btn-group-sm">
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnUp">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnDown">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
              <div class="input-group-prepend">
                <button class="btn btn-info btn-sm btnModalArchivos_recomendacion" type="button" data-toggle="modal" data-target="#modalFileExplorer">
                  <i class="fas fa-folder-open fa-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- RECOMENDACION -->
        <div class="input-group input-group-sm mt-1">
          <textarea class="form-control form-control-sm" id=""
            name="recomendacion_reporte[]" placeholder="Ingresa la recomendación" rows="2">Continuar con su programa de inspecciones por termografía infrarroja con un período no mayor a 6 meses.</textarea>
          <div class="d-flex align-items-center p-1">
            <i class="fas fa-undo-alt btnCamposReporte limpiar recomendacion" style="color:red; cursor: pointer;"></i>
            <i class="fas fa-trash-alt btnCamposReporte eliminar recomendacion pl-1" style="color:red; cursor: pointer;"></i>
          </div>
        </div>
        <!-- IMAGEN RECOMENDACION -->
        <div class="row">
          <div class="col-sm-5 mt-1">
            <div class="input-group input-group-sm" style="" id="">
              <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion[]" id="" placeholder="Nombre archivo">
              <div class="btn-group-vertical btn-group-sm">
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnUp">
                    <i class="fas fa-chevron-up"></i>
                </button>
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnDown">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
              <div class="input-group-prepend">
                <button class="btn btn-info btn-sm btnModalArchivos" type="button" data-toggle="modal" data-target="#modalFileExplorer">
                  <i class="fas fa-folder-open fa-xs"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-5 mt-1">
            <div class="input-group input-group-sm" style="" id="">
              <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion_2[]" id="" placeholder="Nombre archivo">
              <div class="btn-group-vertical btn-group-sm">
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnUp">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnDown">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
              <div class="input-group-prepend">
                <button class="btn btn-info btn-sm btnModalArchivos_recomendacion" type="button" data-toggle="modal" data-target="#modalFileExplorer">
                  <i class="fas fa-folder-open fa-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- RECOMENDACION -->
        <div class="input-group input-group-sm mt-1">
          <textarea class="form-control form-control-sm" id=""
            name="recomendacion_reporte[]" placeholder="Ingresa la recomendación" rows="2">Revisar su sistema general de puesta a tierra para dar cumplimiento a la NOM-001-SEDE- 2012 y NOM-022-STPS-2015.</textarea>
          <div class="d-flex align-items-center p-1">
            <i class="fas fa-undo-alt btnCamposReporte limpiar recomendacion" style="color:red; cursor: pointer;"></i>
            <i class="fas fa-trash-alt btnCamposReporte eliminar recomendacion pl-1" style="color:red; cursor: pointer;"></i>
          </div>
        </div>
        <!-- IMAGEN RECOMENDACION -->
        <div class="row">
          <div class="col-sm-5 mt-1">
            <div class="input-group input-group-sm" style="" id="">
              <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion[]" id="" placeholder="Nombre archivo">
              <div class="btn-group-vertical btn-group-sm">
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnUp">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnDown">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
              <div class="input-group-prepend">
                <button class="btn btn-info btn-sm btnModalArchivos" type="button" data-toggle="modal" data-target="#modalFileExplorer">
                  <i class="fas fa-folder-open fa-xs"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-5 mt-1">
            <div class="input-group input-group-sm" style="" id="">
              <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion_2[]" id="" placeholder="Nombre archivo">
              <div class="btn-group-vertical btn-group-sm">
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnUp">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;" class="btn btn-default btn-sm rounded-0 btnDown">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
              <div class="input-group-prepend">
                <button class="btn btn-info btn-sm btnModalArchivos_recomendacion" type="button" data-toggle="modal" data-target="#modalFileExplorer">
                  <i class="fas fa-folder-open fa-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`
    ;

    document.querySelector("#contenedorTabreferencias").innerHTML=``;
    document.querySelector("#contenedorTabreferencias").innerHTML=`
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">iNETA, Standard for maintenance testing specifications for electrical power equipment and  systems.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">ISO 18434-1, Condition monitoring and diagnostics of machines. Thermography.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">ISO 1843.6-7, Condition monitoring and diagnostics of machines. Requirements for qualification and assessment of personnel - Thermography.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NFPA 70B, Prácticas recomendadas para el mantenimiento de equipos eléctricos.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NOM-001-SEDE-2012, Instalaciones eléctricas (utilización).</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NOM-001-STPS-2012, Condiciones de seguridad en centros de trabajo</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NOM-002-STPS-2010, Condiciones de seguridad-prevención y protección contra incendios.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NOM-005-STPS-1998, Manejo de sustancias químicas peligrosas.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NOM-009-ENER-2014, Eficiencia energética en sistemas de aislamientos térmicos industriales.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NOM-022-STPS-2015, Electricidad estática en centros de trabajo.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NOM-029-STPS-2011, Mantenimiento de las instalaciones eléctricas.</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
      <!-- referencia -->
      <div class="input-group input-group-sm mt-1">
        <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">NMX-J-549, Pararrayos y Sistemas de Puesta a Tierra</textarea>
        <div class="d-flex align-items-center p-1">
          <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
          <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
        </div>
      </div>
    `;
  }

  function generarReporteBaseLine(tipo_reporte = ""){
    return new Promise((resolve, reject) => {
      arrayUbicacionesOrdenadas = [];
      var orden_ubicaciones = obtener_orden_ubicaciones(datos_treeview);
      
      $.ajax({
        url: "/inventarios/generarReporteBaseLine",
        type: "POST",
        dataType: 'json',
        data: {orden_ubicaciones: orden_ubicaciones},
        success: function (res) {

          if(tipo_reporte == "individual"){
            
            Toast.fire({
              icon: 'success',
              title: 'Reporte generado'
            })
          }

          resolve('succes');
        },
        error: function (error) {
          reject(error)
        },
      });

    })
  }
  
  function obtener_orden_ubicaciones(arreglo){
    // console.log(arreglo)
    arreglo.forEach(element => {
      arrayUbicacionesOrdenadas.push(element.id)
      if (element.hasOwnProperty('nodes')){
        obtener_orden_ubicaciones(element.nodes)
      }

    });
    return arrayUbicacionesOrdenadas;

  }

  function generarGraficaConcentradoProblemas(tipo_reporte = ""){
    $.ajax({
      url: "/inventarios/generarGraficaConcentradoProblemas",
      type: "POST",
      dataType: 'json',
      success: function (res) {

        if(tipo_reporte == "individual"){
          
          Toast.fire({
            icon: 'success',
            title: 'Reporte generado'
          })
        }
      }
    });
  }

  function seleccionarFechasReporteExcelProblemas(){
    $('#modal_fechas_reporte_excel_problemas').modal('show');
  }

  function validarFrmFechasExcelProblemas(){
    procesoValidacionFechasExcelProblemas = $('#frm_seleccionar_fechas_excel_problemas').validate({
      rules: {
        fecha_inicio_reporte_excel: {required: true,},
        fecha_fin_reporte_excel: {required: true,},
      },
      messages: {
        fecha_inicio_reporte_excel: {required: "Seleccionar fecha",},
        fecha_fin_reporte_excel: {required: "Seleccionar fecha",},
      },
      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
      }
    });
  }

  function limpiarFrmFechasExcelProblemas(){
    console.log('se cerro mdl')
    // Limpia los valores del form
    $('#frm_seleccionar_fechas_excel_problemas')[0].reset();
    // Quita los mensajes de error y limpia los valodes del form
    procesoValidacionFechasExcelProblemas.resetForm();
    // Quita los estilos de error de los inputs
    $('#frm_seleccionar_fechas_excel_problemas').find(".is-invalid").removeClass("is-invalid");
  }

  function generarReporteListaProblemasExcel(){
    if($("#frm_seleccionar_fechas_excel_problemas").valid()){
      
      let fecha_inicio = document.querySelector("#fecha_inicio_reporte_excel").value;
      let fecha_fin = document.querySelector("#fecha_fin_reporte_excel").value;
      console.log(fecha_fin);
      $.ajax({
        url: `/inventarios/generarReporteListaProblemasExcel/${fecha_inicio}/${fecha_fin}`,
        type: "POST",
        dataType: 'json',
        success: function (res) {
          Toast.fire({
            icon: 'success',
            title: 'Reporte generado'
          })
          $("#modal_fechas_reporte_excel_problemas").modal("hide");
        },
        error: function (err) {
          console.log(err)
          Toast.fire({
            icon: 'error',
            title: 'Error al generar reporte'
          }).then((result) => {
            Toast.fire({
              icon: 'warning',
              title: 'Verificar que el archivo NO esté abierto'
            })
          })
        }
      });

    }
  }

  function colocar_datos_reporte(){
    // peticion a la base
    $.ajax({
      url: `/inventarios/obtener_datos_reporte`,
      type: "get",
      data:'',
      dataType: 'json',
      success: function (data){

        /* si no hay nigun dato guardado anteriormente para el reporte
        entonces carga solo los contactos del sitio */
        if (data === null || data.length < 1) {
          cargarContactos();
          return
        }

        /* Si ya hay datos guardados del reporte entonces cargamos esos datos */

        /* Detalles del sitio */
        document.querySelector("#detalle_ubicacion").value = data.detalle_ubicacion;

        /* Creacion de los elementos con los nombres guardados */
        let array_nombres = data.nombre_contacto.split("$");
        array_nombres.forEach(function callback(nombre, index) {
          document.querySelector(`#nombre_contacto_${index+1}`).value = nombre;
        });
        
        /* Creacion de los elementos con los puestos guardados */
        let array_puestos = data.puesto_contacto.split("$");
        array_puestos.forEach(function callback(puesto, index) {
          document.querySelector(`#puesto_contacto_${index+1}`).value = puesto;
        });
        
        /* Fechas del reporte */
        document.querySelector("#fecha_inicio_ra").value = data.fecha_inicio_ra;
        document.querySelector("#fecha_fin_ra").value = data.fecha_fin_ra;
        
        /* Imagen de la portada */
        document.querySelector("#nombre_img_portada").value = data.nombre_img_portada;
        
        /* Descripciones guardadas */
        let array_descripciones = data.descripcion_reporte.split("$");
        array_descripciones.forEach(function callback(descripcion, index) {
          if(index == 0){
            document.querySelector("#descripcion_reporte").textContent = descripcion ;
          }else{

            let div_contenedor = document.createElement('div');
            div_contenedor.classList.add("input-group","input-group-sm","mt-1");

            div_contenedor.innerHTML = `
              <textarea class="form-control form-control-sm" id=""
              name="descripcion_reporte[]" placeholder="Ingresa la descripción" rows="2">${descripcion}</textarea>
              <div class="d-flex align-items-center p-1">
                <i class="fas fa-trash-alt btnCamposReporte eliminar" style="color:red; cursor: pointer;"></i>
              </div>
            `;

            document.querySelector("#contenedorDescripciones").appendChild(div_contenedor);

          }
        });

        /* Areas inspeccionas */
        let array_areas_inspeccionadas = data.areas_inspeccionadas.split("$");
        array_areas_inspeccionadas.forEach(function callback(area, index) {
          if(index == 0){
            document.querySelector("#areas_inspeccionadas").textContent = area ;
          }else{

            let div_contenedor = document.createElement('div');
            div_contenedor.classList.add("input-group","input-group-sm","mt-1");
            
            div_contenedor.innerHTML = `
              <textarea class="form-control form-control-sm" id=""
              name="areas_inspeccionadas[]" placeholder="Ingresa la descripción" rows="2">${area}</textarea>
              <div class="d-flex align-items-center p-1">
                <i class="fas fa-trash-alt btnCamposReporte eliminar" style="color:red; cursor: pointer;"></i>
              </div>
            `;

            document.querySelector("#contenedorAreas").appendChild(div_contenedor);

          }
        });

        /* Creacion de los elementos de recomendaciones y sus imagenes guardadas */
        let imagen_recomendacion = data.imagen_recomendacion.split("$");
        let imagen_recomendacion_2 = data.imagen_recomendacion_2.split("$");
        let array_recomendacion_reporte = data.recomendacion_reporte.split("$");
        document.querySelector("#contenedorTabrecomendaciones").innerHTML = "";
        array_recomendacion_reporte.forEach(function callback(recomendacion, index) {
          
          let div_contenedor = document.createElement('div');
          div_contenedor.classList.add("input-group","input-group-sm","mt-1");

          let div_contenedor_recomendaciones = document.createElement('div');
          div_contenedor_recomendaciones.innerHTML = "";
          div_contenedor.innerHTML += `
            <textarea class="form-control form-control-sm" id=""
            name="recomendacion_reporte[]" placeholder="Ingresa la descripción" rows="2">${recomendacion}</textarea>
          `;

          if (index == 0) {
            div_contenedor.innerHTML += `
            <div class="d-flex align-items-center p-1">
              <i class="fas fa-undo-alt btnCamposReporte limpiar recomendacion" style="color:red; cursor: pointer;"></i>
            </div>
          `;
          }else if(index > 0 && index < 3) {
            div_contenedor.innerHTML += `
            <div class="d-flex align-items-center p-1">
              <i class="fas fa-undo-alt btnCamposReporte limpiar recomendacion" style="color:red; cursor: pointer;"></i>
              <i class="fas fa-trash-alt btnCamposReporte eliminar recomendacion pl-1" style="color:red; cursor: pointer;"></i>
            </div>
          `;
          }else{
            div_contenedor.innerHTML += `
            <div class="d-flex align-items-center p-1">
              <i class="fas fa-trash-alt btnCamposReporte eliminar recomendacion pl-1" style="color:red; cursor: pointer;"></i>
            </div>
          `;
          }
          
          let div_contenedor_img = document.createElement('div');
          div_contenedor_img.classList.add("row");
          div_contenedor_img.innerHTML = `
            <div class="col-sm-5 mt-1">
                <div class="input-group input-group-sm" style="" id="">
                    <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion[]" id="" placeholder="Nombre archivo" value="${imagen_recomendacion[index]}">
                    <div class="btn-group-vertical btn-group-sm">
                        <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                            class="btn btn-default btn-sm rounded-0 btnUp">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                            class="btn btn-default btn-sm rounded-0 btnDown">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
                    <div class="input-group-prepend">
                        <button class="btn btn-info btn-sm btnModalArchivos_recomendacion" type="button" data-toggle="modal"
                            data-target="#modalFileExplorer">
                            <i class="fas fa-folder-open fa-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-sm-5 mt-1">
              <div class="input-group input-group-sm" style="" id="">
                  <input type="text" class="form-control form-control-sm inputIR inputTextImg" name="imagen_recomendacion_2[]" id="" placeholder="Nombre archivo" value="${imagen_recomendacion_2[index]}">
                  <div class="btn-group-vertical btn-group-sm">
                      <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                          class="btn btn-default btn-sm rounded-0 btnUp">
                          <i class="fas fa-chevron-up"></i>
                      </button>
                      <button type="button" style="font-size:7px;margin:0;padding:0;width:20px;"
                          class="btn btn-default btn-sm rounded-0 btnDown">
                          <i class="fas fa-chevron-down"></i>
                      </button>
                  </div>
                  <button type="button" class="btn btn-default btn-sm rounded-0 btnGetLastImg" style="margin:0;padding:0;width:20px;">...</button>
                  <div class="input-group-prepend">
                      <button class="btn btn-info btn-sm btnModalArchivos_recomendacion" type="button" data-toggle="modal"
                          data-target="#modalFileExplorer">
                          <i class="fas fa-folder-open fa-xs"></i>
                      </button>
                  </div>
              </div>
            </div>
          `;
  
          div_contenedor_recomendaciones.appendChild(div_contenedor);
          div_contenedor_recomendaciones.appendChild(div_contenedor_img);
          document.querySelector("#contenedorTabrecomendaciones").appendChild(div_contenedor_recomendaciones);

        });
      
        /* Creacion delas referencias guardadas */
        let array_referencia_reporte = data.referencia_reporte.split("$");
        document.querySelector("#contenedorTabreferencias").innerHTML = ""
        array_referencia_reporte.forEach(function callback(referencia, index) {

          document.querySelector("#contenedorTabreferencias").innerHTML += `
            <div class="input-group input-group-sm mt-1">
              <textarea class="form-control form-control-sm" id="" name="referencia_reporte[]" placeholder="Ingresa la recomendación" rows="1">${referencia.trim()}</textarea>
              <div class="d-flex align-items-center p-1">
                <i class="fas fa-undo-alt btnCamposReporte limpiar" style="color:red; cursor: pointer;"></i>
                <i class="fas fa-trash-alt btnCamposReporte eliminar pl-1" style="color:red; cursor: pointer;"></i>
              </div>
            </div>
          `;

        });
        

      },
      error: function (error) {
        console.log(error);
      },
    });
  }


  var i = 0;
  var dragging = false;
  $('#dragbar').mousedown(function(e){
      e.preventDefault();
      
      dragging = true;
      var main = $('#main');
      var ghostbar = $('<div>',
                      {id:'ghostbar',
                        css: {
                              height: main.outerHeight(),
                              top: main.offset().top,
                              left: main.offset().left
                              }
                      }).appendTo('body');
      
      $(document).mousemove(function(e){
        ghostbar.css("left",e.pageX+2);
      });
      
  });

  $(document).mouseup(function(e){
      if (dragging) 
      {
          var percentage = (e.pageX / window.innerWidth) * 100;
          var mainPercentage = 100-percentage;
                      
          $('#sidebar').css("width",percentage + "%");
          $('#main').css("width",mainPercentage + "%");
          $('#ghostbar').remove();
          $(document).unbind('mousemove');
          dragging = false;
          console.log("aqui")
        //  $('.jsgrid-header-cell').trigger("click");
        $("#jsGridInventario").css('width', 'auto')
      }
  });





});