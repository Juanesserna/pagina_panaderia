// Abre una ventana con el comprobante y lanza el diálogo de impresión/PDF.
export function imprimirComprobante(elemento, idVenta) {
  if (!elemento) return
  const ventana = window.open('', '_blank', 'width=480,height=700')
  if (!ventana) return
  ventana.document.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8" /><title>Comprobante ${idVenta}</title>
      <style>body{margin:0;padding:24px;display:flex;justify-content:center;background:#fff;font-family:monospace;}@media print{body{padding:0;}}</style>
      </head><body>${elemento.outerHTML}
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};}<\u002Fscript>
      </body></html>
    `)
  ventana.document.close()
}
