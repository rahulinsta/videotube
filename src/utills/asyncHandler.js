const asyncHandler = (requestHandler) =>{
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err)=> next(err))
    }
}




//THIS CODE IS JUST  A SMAPLE OF USING AYSNC AND AWAIT METHODS

// const asyncHandler = (fn) => async(req, res, next) => {
//     try{

//         await fn(res, res, next)

//     }catch(err){
//         res.status(err.code || 500).json(
//             {
//                 success: false,
//                 message: err.message
//             }
//         )
//     }
// }