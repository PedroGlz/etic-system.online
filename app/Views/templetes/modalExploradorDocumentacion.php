  <!-- ========== Modal Archivos =============================================================================-->
  <div class="modal fade" id="modal_documentacion" data-backdrop="static" tabindex="-1" role="dialog"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            <i class="fa fa-folder-open" style="font-size:24px;color:gray;"></i>
            &nbsp;Documentación
          </h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="">

            <div class="row">
              <div class="col-sm-9">
                <form action="/inventarios/subirDocumentacion" id="FormArchivosImg" method="POST">
                  <div class="input-group input-group-sm">
                    <input type="file" name='documentacion[]' id="documentacion" multiple="" class="form-control">
                    <button type="button" id="btnSubirImg" class="btn btn-info btn-sm rounded-0">
                      <i class="fas fa-upload"></i>
                    </button>
                    <button type="button" id="btnLimpiarMultiFile" class="btn btn-secondary btn-sm rounded-0">
                      <i class="fas fa-times"></i>
                      </button>
                  </div>
                </form>
              </div>
              <div class="col-sm-3 d-flex justify-content-end">
                <button type="button" class="btn btn-danger btn-sm" id="btnEliminarImg"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>

            <hr class="mt-1 mb-1" />

            <div class="row" id="">
              <div class="row" id="exploradorArchivos"></div>
            </div>

          </div>

        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary btn-sm" id="btnSeleccionarImg">Seleccionar</button>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
  <!-- /.modal -->