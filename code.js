class VistaPeliculaHTML {
    constructor() {
        this.main = document.querySelector("main");
    }
    mostrarPelicula(pelicula) {
        let div = document.createElement("div");
        div.setAttribute('id', pelicula.imdbID);
        div.setAttribute("class", "pelicula");
        let divFoto = document.createElement("div");
        let nombre = document.createElement('h2')
        let foto = document.createElement('img')

        nombre.innerHTML = pelicula.Title;
        foto.src = pelicula.Poster=='N/A'?'no-image-found.webp':pelicula.Poster;
        div.appendChild(nombre)
        divFoto.appendChild(foto)
        div.appendChild(divFoto)
        this.main.appendChild(div);
        return div;
    }
    sinCoincidencias() {
        let div = document.createElement("div");
        div.setAttribute("class", "sinCoincidencias");
        let nombre = document.createElement('h2')
        nombre.innerHTML = "No hay coincidencias o más resultados";
        div.appendChild(nombre)
        this.main.appendChild(div);
    }
    mostrarDetalle(datosPelicula) {
        let div = document.createElement("div");
        div.setAttribute("class", "detalle");
        let divTexto = document.createElement("div");
        divTexto.setAttribute("class", "texto");
        let divFoto = document.createElement("div");
        divFoto.setAttribute("class", "foto");
        let nombre = document.createElement('h2')
        let foto = document.createElement('img')
        let director = document.createElement('p')
        let genero = document.createElement('p')
        let duracion = document.createElement('p')
        let sinopsis = document.createElement('p')
        let actores = document.createElement('p')
        let boton = document.createElement('button')
        boton.setAttribute('class', 'volver')
        boton.innerHTML = "Volver"
        boton.addEventListener("click", (e) => {
            e.target.parentNode.remove();   
            this.main.parentNode.style.overflow = "auto";
        })
        nombre.innerHTML = datosPelicula.Title;
        foto.src = datosPelicula.Poster=='N/A'?'no-image-found.webp':datosPelicula.Poster;
        director.innerHTML = "Director: " + datosPelicula.Director;
        genero.innerHTML = "Género: " + datosPelicula.Genre;
        duracion.innerHTML = "Duración: " + datosPelicula.Runtime;
        sinopsis.innerHTML = "Sinopsis: " + datosPelicula.Plot;
        actores.innerHTML = "Actores: " + datosPelicula.Actors;
        divTexto.appendChild(divFoto)
        divTexto.appendChild(nombre)
        divTexto.appendChild(director)
        divTexto.appendChild(genero)
        divTexto.appendChild(duracion)
        divTexto.appendChild(sinopsis)
        divTexto.appendChild(actores)
        div.appendChild(boton)
        divFoto.appendChild(foto)
        div.appendChild(divTexto)
        this.main.appendChild(div);
        div.style.top = window.scrollY + '50px';
        this.main.parentNode.style.overflow = 'hidden';
    }

    errorConexion() {
        let div = document.createElement("div");
        div.setAttribute("class", "errorConexion");
        let nombre = document.createElement('h2')
        nombre.innerHTML = "Error de conexión";
        div.appendChild(nombre)
        this.main.appendChild(div);
    }

}


var httpRequest = new XMLHttpRequest();
var recarga = true;
var coincidencias = true
var i = 1;
window.onload = () => {
    document.querySelector("button").addEventListener("click", () => {
        coincidencias = true;
        display();
    });
    document.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            coincidencias = true;
            display();
        }
    });
}

function display() {
    if(!coincidencias)
        return;
    document.querySelector("main").innerHTML = "";
    i = 1;
    recogePeliculas();
    window.addEventListener('scroll', () => {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight -10) {
            i++;
            recogePeliculas(i);
            recarga = false;
        }
    });
}

function recogePeliculas(i = 1) {
    if (!coincidencias)
        return;
    httpRequest.open("GET", `https://www.omdbapi.com/?s=${document.querySelector('input').value}&page=${i}&apikey=70e51670`, true);
    httpRequest.onreadystatechange = tomaPeliculas;
    httpRequest.send();
}

function tomaPeliculas() {
    var pelicula = new VistaPeliculaHTML();
    if (httpRequest.readyState == 4) {
        var valores;
        if (httpRequest.status == 200) {
            valores = JSON.parse(httpRequest.responseText);
            // console.log('trae datos');
            if (valores.Response == "True") {
                let divIndividual;
                for (let i = 0; i < valores.Search.length; i++) {
                    divIndividual = pelicula.mostrarPelicula(valores.Search[i]);
                    divIndividual.addEventListener("click", () => {
                        recogeDetalle(valores.Search[i].imdbID);
                    });
                }
                recarga = true;
            }
            else {
                pelicula.sinCoincidencias();
                coincidencias = false;
                recarga = true;
            }
        }
        else {
            p = document.createElement("p");
            p.innerHTML = "Error de conectividad";
            document.querySelector("body").appendChild(p);
            p.style.color = "red";
        }
    }
}


function recogeDetalle(idPelicula) {
    httpRequest.open("GET", `https://www.omdbapi.com/?i=${idPelicula}&apikey=70e51670`, true);
    httpRequest.onreadystatechange = tomaDetalle;
    httpRequest.send();
}

function tomaDetalle() {
    var pelicula = new VistaPeliculaHTML();
    if (httpRequest.readyState == 4) {
        var valores;
        if (httpRequest.status == 200) {
            valores = JSON.parse(httpRequest.responseText);
            console.log('trae datos');
            pelicula.mostrarDetalle(valores);
        }
        else {
            p = document.createElement("p");
            p.innerHTML = "Error de conectividad";
            document.querySelector("body").appendChild(p);
            p.style.color = "red";
        }
    }
}