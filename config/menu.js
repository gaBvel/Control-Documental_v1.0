/* Menu del Sidebar */
const menus = {
    Director: [
        {
            id:"dashboard",
            name:"Inicio",
            icon:"fa-solid fa-house",
            url:"/director"
        },

        {
            id:"inventario",
            name:"Inventario",
            icon:"fa-solid fa-box-archive",
            url:"/director/inventario"
        },

        {
            id:"historial",
            name:"Historial",
            icon:"fa-solid fa-clock-rotate-left",
            url:"/director/historial"
        }
    ],

    Archivo:[
        {
            id:"dashboard",
            name:"Inicio",
            icon:"fa-solid fa-house",
            url:"/archivo"
        },

        {
            id:"revision",
            name:"Revisión",
            icon:"fa-solid fa-magnifying-glass",
            url:"/archivo/revision"
        },

        {
            id:"historial",
            name:"Historial",
            icon:"fa-solid fa-clock-rotate-left",
            url:"/archivo/historial"
        }
    ],

    
    Usuario:[
        {
            id:"dashboard",
            name:"Inicio",
            icon:"fa-solid fa-house",
            url:"/usuario"
        },

        {
            id:"inventario",
            name:"Inventario",
            icon:"fa-solid fa-box-archive",
            url:"/usuario/inventario"
        },

        {
            id:"normativa",
            name:"Normatividad",
            icon:"fa-solid fa-book",
            url:"/usuario/normativa"
        },

        {
            id:"historial",
            name:"Historial",
            icon:"fa-solid fa-clock-rotate-left",
            url:"/usuario/historial"
        }
    ],

    Administrador:[
        {
            id:"dashboard",
            name:"Inicio",
            icon:"fa-solid fa-house",
            url:"/admin"
        }
    ]
};

function getMenu(role,current){
    return menus[role].map(item=>({
        ...item,
        active:item.id===current
    }));
}

module.exports={ menus, getMenu };
