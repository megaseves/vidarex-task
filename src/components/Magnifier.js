import './Magnifier.css';
import {useEffect, useRef, useState} from "react";

function imageZoom(imgID, zoomLevel) {
    (document.getElementById('lens') !== null) && document.getElementById('lens').remove();

    let img = document.getElementById(imgID);

    let lens = document.createElement("DIV");
    lens.setAttribute("id", "lens");
    lens.setAttribute("class", "img-zoom-lens");

    img.parentElement.insertBefore(lens, img);

    let cx = zoomLevel / (lens.offsetWidth * 2); // 200 / 100
    let cy = zoomLevel / (lens.offsetHeight * 2);

    lens.style.backgroundImage = "url('" + img.src + "')";
    lens.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);

    function moveLens(e) {
        let pos = getCursorPos(e);

        let x = pos.x;
        let y = pos.y;

        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }


        lens.style.left = x + "px";
        lens.style.top = y + "px";

/*        if (cx < 2) {
            lens.style.background = '';
        }*/

        const posX = x * cx + ((cx - 1) * 25);
        const posY = y * cy + ((cy - 1) * 25);
        lens.style.backgroundPosition = "-" + posX + "px -" + posY + "px";

    }

    function getCursorPos(e) {
        let a, x = 0, y= 0;

        e = e || window.event;
        a = img.getBoundingClientRect();
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        x = x - window.scrollX;
        y = y - window.scrollY;
        return { x: x, y : y};
    }

}


function Magnifier() {
    const app = document.body;
    const [zoom, setZoom] = useState(200);
    const [allFilters, setAllFilters] = useState({
        saturate: 1,
        R: 0,
        G: 0,
        B: 0
    });
    const [saturate, setSaturate] = useState(0);

    useEffect(() => {
        imageZoom("img-original", zoom);
    }, [zoom, setZoom]);

    function appFilter() {

        let lens = document.getElementById('lens');
        let filterControls = document.querySelectorAll('.filter');

        let computedFilters = '';
        filterControls.forEach(function(item, index) {
            computedFilters += item.getAttribute('data-filter') + '(' + item.value + item.getAttribute('data-scale') + ') ';
            console.log(computedFilters)
            if (item.getAttribute('data-filter') === 'saturate') {
                setSaturate(item.value);
            }
        })
        lens.style.filter = computedFilters;
    }

    function checkFilters() {
        const lens = document.getElementById('lens');
        let computedFilters = '';
        for (const [key, value] of Object.entries(allFilters)) {
            console.log(`${key}: ${value}`);
            if(key === 'saturate') {
                computedFilters += key + '(' + value + ')';
            }
        }
        lens.style.filter = computedFilters;
        console.log(computedFilters)
    }


    app.addEventListener("keydown", (event) => {
        if (event.code === 'ArrowLeft') {
            if (allFilters.saturate > 1) {
                allFilters.saturate = allFilters.saturate - 10;
            }
        } else if (event.code === 'ArrowRight') {
            if (allFilters.saturate <= 100) {
                allFilters.saturate = allFilters.saturate + 10;
            }
        }
        checkFilters();
    });

    app.addEventListener("wheel", (event) => {
       if (event.deltaY < 0) {
           console.log('up')
           if(zoom < 1000) {
               setZoom(zoom + 100);
           }
       }
       else if (event.deltaY > 0) {
           console.log('down');
           if(zoom > 100) {
               setZoom(zoom - 100);
           }
       }
    });

    function canvasImageModify() {


    }

    useEffect(() => {
        canvasImageModify();
    }, []);


    return (
        <div className="Magnifier">
            <div className="head">
                <div className="img-wrapper">

                    <img id={'img-original'} src={'./images/city.jpg'}  alt={'city'} width={768} height={432} />
                </div>
                <div className="zoom">
                    <h4>{zoom}</h4>
                    <input className={'zoomSlider'} type="range" min={100} max={1000} step={100} value={zoom} onChange={(e) => setZoom(e.target.value)}/>
                </div>
            </div>
            <div className="filters">
                <label>Saturate</label>
                <input className="filter" type="range" min={1} max={100} value={saturate} step={10} onChange={appFilter} data-filter={"saturate"} data-scale={""}/>
            </div>
        </div>
    );
}

export default Magnifier;
