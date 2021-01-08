Number.prototype.mapnr = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class ColorLite extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');  
      this.content = document.createElement('div');	
      card.appendChild(this.content);	  
	  card.style.background = 'none';	  
      this.appendChild(card);	  
    }

    const entityId = this.config.entity;  	
	const state = hass.states[entityId];
		
	
//  if the light is on	
if(state){
	console.log(state);

	if(state.state == 'on'){
	
		const imageURLId = this.config.image;			
		var ImURL = imageURLId;		
		const imageURLCId = this.config.color_image;				
		var rgbval = state.attributes.rgb_color;			
		var hsval = state.attributes.hs_color;			
		var hsar = "";
		var min_bright = (this.config.min_brightness * 2.5);
		var bright = state.attributes.brightness;
		var color_temp = state.attributes.color_temp; // for color temp lamps

		if(color_temp){
			var min_mireds = state.attributes.min_mireds;
			var max_mireds = state.attributes.max_mireds;
			
			var hue_rotate = color_temp.mapnr(min_mireds, max_mireds, 15, -10);
			var sepia = color_temp.mapnr(min_mireds, max_mireds, 30, 0);
			var saturation = color_temp.mapnr(min_mireds, max_mireds, 1, 1.5);

			var hsar = ' sepia(' + sepia + '%) hue-rotate(' + hue_rotate + 'deg) saturate(' + saturation + ')';
		}

		if (hsval) {
			if (rgbval != "255,255,255") {				
				var hsar = ' hue-rotate(' + hsval[0] + 'deg)';			
				if (imageURLCId) {
				ImURL = imageURLCId;		
				}
			}
		}		
		// recalc brightness if min_brightness set
		//var bbritef = bright;
		var bbritef = bright.mapnr(0,255, min_bright, 255);

		// if (min_bright > bright) {
		// 	bbritef = min_bright;
		// }
		var bbrite = (bbritef / 205);
	
		this.content.innerHTML = `	
<!-- Custom Lite Card for x${rgbval}x -->	
<img src="${ImURL}" style="filter: opacity(${bbrite})${hsar}!important;" width="100%" height="100%">
`;
	
	} else {			
		this.content.innerHTML = `
	<!-- Custom Lite Card for ${entityId} is turned off -->
	`;			
	}	
  }  
}  


  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }  
  
  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('color-lite-card', ColorLite);
