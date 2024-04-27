
class ApiError extends Error{

    constructor(
        statusCode ,
        mssg ,
        errors = "Something went wrong" ,
        stack = "" 
    ){
        super(mssg) ;
        this.statusCode = statusCode 
        this.message = mssg 
        this.success = false
        this.errors = errors 

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}

export {ApiError};