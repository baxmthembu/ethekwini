const Validate = (formData) => {
    const requiredFields = ['name', 'id_number', 'password']
    let proceed = true
    let errorMessage = 'Please enter value for '

    requiredFields.forEach(field => {
        if(!formData[field] || formData[field] === '') {
            proceed = false;
            errorMessage += `${field.charAt(0).toUpperCase() + field.slice(1)}, `;
        }
    })

    if(!proceed){
        console.error(errorMessage.slice(0, -2))
        return {isValid: false, errorMessage: errorMessage.slice(0, -2)}
    }

    if(formData.id_number < 13){
        console.error('Id number too short')
        return {isValid: false, errorMessage: 'Id number too short'};
    }
    
    return {isValid: true}
}

export default Validate