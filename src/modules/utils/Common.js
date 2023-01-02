const addComma = (number) => number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const strTrim = (string) => string.replace(/^\s+|\s+$/g,'');

const extractCategory = (category) =>
  category?.replace(/\{/g, '').replace(/\}/g, '').split(',')[category.split(',').length - 1]

const deviceCheck = () =>{
    let pc_device = "win16|win32|win64|mac|macintel";
    let this_device = navigator.platform;
    if(this_device){
        if ( pc_device.indexOf(navigator.platform.toLowerCase()) < 0 ) {
            return 'M';
        } else {
            return 'PC';
        }
    }
}

export { addComma, strTrim, extractCategory, deviceCheck }
