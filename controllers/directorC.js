
const menus=require("../config/menu");

exports.director=(req,res)=>{
    res.render("Director/director",{
        title:"Panel Director",
        menu:menus.Director,
        usuario:req.session.usuario
    });
}