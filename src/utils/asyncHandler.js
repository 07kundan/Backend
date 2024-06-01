

// ------------ Using Promise -----------------
const asyncHandler = (func) => {
    (req, res, next) => {
        Promise.resolve(func(req, res, next))
            .catch((error) => next(error))
    }
}

export { asyncHandler }




// ------- Using trycatch ------------

// Higher order function
/*
const asyncHandler = (func) => async (req, res, next) => {        // same as ---> ()=>{()=>{}}
    try {
        await func(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/