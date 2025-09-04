//En desarrollo tendrá un valor vacío, se sobrescribira con config.js
// En producción lo sobrescribiremos, ejem. desde Docker-> conf.->sección environment
window.__ENV = {
  API_URL: "" 
};