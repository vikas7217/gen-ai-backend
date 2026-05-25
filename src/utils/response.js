
export const data =(success,message,data) => {
return{
    success: success || false,
    message: message || "No message provided",
    data: data || null,
}
}