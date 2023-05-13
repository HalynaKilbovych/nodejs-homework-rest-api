const ctrlWrapper = ctrl => { 
    const func = (req, res, next) => { 
        try { 
            await ctrl(req, res, next); 
        }
        catch(error){ 
            next(error); 
        }
    }
}

module.exports = ctrlWrapper; 