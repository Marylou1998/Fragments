let simulation;

setInterval(() => {
    const strikes = document.querySelectorAll('.strike');
    strikes.forEach(strike => {
      strike.classList.remove('strike');
      void strike.offsetWidth; 
      strike.classList.add('strike');
    });
    const reveals = document.querySelectorAll('.inserted-text.reveal');
    reveals.forEach(reveal => {
      reveal.classList.remove('reveal');
      void reveal.offsetWidth;
      reveal.classList.add('reveal');
    });
}, 5000);

const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

const svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
      
d3.json("Fragments.json")      //tout le code qui doit être dans le d3.json
    .then(data => {
        const nodes = data.data.nodes;
        const links = data.data.links;
        const nodeGroups = Array.from(new Set(nodes.map(d => d.group)));
        const nodeImages = Array.from(new Set(nodes.map(d => d.imageUrl)));
        const nodeTypes = Array.from(new Set(nodes.map(d => d.type)));
        const nodeText = Array.from(new Set(nodes.map(d => d.texte)));
        const nodeTitle = Array.from(new Set(nodes.map(d => d.name)));
        const customColors = ["#B759E3", "#1eaeb8", "#1a5678", "#870E85", "#B3BFFF"];
        const colorScale = d3.scaleOrdinal()
            .domain(nodeTypes)
            .range(customColors);

        var sidePanel = d3.select("body").append("div")
            .attr("class", "sidePanel");   

        var about = d3.select("body").append("div")
            .attr("class", "about");
            var textContent = "En savoir plus";
            about.html(textContent);
        var aboutOverlay = d3.select("body").append("div")
            .attr("class", "about-overlay");
            about.on("click", function() {
            aboutOverlay.style("display", function() {
                return aboutOverlay.style("display") === "none" ? "block" : "none";
            });
            });
            var aboutOverlayContent = aboutOverlay.append("div")
            .attr("class", "overlay-content");
            aboutOverlayContent.html("Additional information goes here...");

            var Legendes = d3.select("body").append("div")
            .attr("class", "Legendes"); 
            var textContent = "<span class=\"lettres-link\" data-content=\"La découverte du manuscrit des <i>Lettres de Mistriss Henley</i> d'Isabelle de Charrière est à l'origine de cette édition numérique. Il a été retrouvé en 2023 aux Archives de l'État de Neuchâtel. Les <i>Lettres</i> ont été publiées en 1784 en réponse au <i>Mari sentimental</i>.\">Manuscrit des <i>Lettres de Mistriss Henley</i></span><br><span class=\"mari-link\" data-content=\"- Un roman de 1783, d'abord publié anonymement, de Samuel Constant de Rebecque.\">Le <i>Mari sentimental</i></span><br><span class=\"justification-link\" data-content=\"Cette oeuvre anonyme a été écrite en réponse aux <i>Lettres de Mistriss Henley</i> en 1785.\">La <i>Justification de M. Henley</i></span><br><span class=\"correspondance-link\" data-content=\"La correspondance d'Isabelle de Charrière contient des lettres écrites et reçues par l'écrivaine, notamment sa correspondance avec Isabelle de Gélieu, sa protégée.\">La correspondance d'Isabelle de Charrière</span><br><span class=\"isabelles-link\" data-content=\"Isabelle de Charrière a poussé Isabelle de Gélieu à écrire <Louise et Albert</i> en réponse à <i>Camilla</i> de Fanny Burney. Ce roman a été publié en 1803.\"><i>Louise et Albert</i></span>";
            Legendes.html(textContent);
            Legendes.selectAll("span")
                .style("color", function() {
                    return d3.select(this).attr("class") === "lettres-link" ? "#B759E3" :
                        d3.select(this).attr("class") === "mari-link" ? "#1eaeb8" :
                        d3.select(this).attr("class") === "justification-link" ? "#1a5678" :
                        d3.select(this).attr("class") === "correspondance-link" ? "#870E85" :
                        "#B3BFFF";
                })
                .style("text-decoration", "none")
                .on("mouseover", function() {
                var content = d3.select(this).attr("data-content");
                var rect = this.getBoundingClientRect();
                var x = rect.left + window.scrollX ;
                var y = rect.top + window.scrollY - 40;
        
                d3.select("#tooltip")
                    .style("left", x + "px")
                    .style("top", y + "px")
                    .style("display", "block")
                    .html(content);
                })
                    .on("mouseout", function() {
                        d3.select("#tooltip").style("display", "none");
                    });       

        const defaultNodeId = 1;

        const defaultNode = nodes.find(node => node.id === defaultNodeId);
            if (defaultNode) {
                displayNodeText(defaultNode);
            } else {
                sidePanel.html("<p>Aucun nœud avec l'ID 1 n'a été trouvé.</p>");
            }

        function highlightNodeById(id) {             
            node.classed("yellow-node", false);             
            node.filter(d => d.id === parseInt(id)).classed("yellow-node", true);             
            }
                      
        
        function displayNodeText(d) {
            if (d.texte) {
                const textWithLinks = d.texte.replace(/<a href=\"#(\d+)\">(.+)<\/a>/g, (match, id, label) => {
                    return `<a href="#" class="node-link" data-target-id="${id}">${label}</a>`;
                });
            sidePanel.html(`${textWithLinks}`);
            
            sidePanel.selectAll('.node-link').on('click', function(event) {
                const targetId = d3.select(this).attr('data-target-id');
                const targetNode = nodes.find(node => node.id === parseInt(targetId));
                if (targetNode) {
                    displayNodeText(targetNode);
                    highlightNodeById(targetNode.id);
                    playPaper();
                    d3.select("body").style("background-image", "none");
                }
            sidePanel.node().scrollTop = 0;
            event.preventDefault();
            
            });
        }}

        function highlightNodeById(id) {
            node.classed("yellow-node", false);
            node.classed("green-node", false);
            node.filter(d => d.id === parseInt(id)).classed("yellow-node", true);
            const linkedNodes = links
                .filter(link => link.source.id === parseInt(id) || link.target.id === parseInt(id))
                .map(link => link.source.id === parseInt(id) ? link.target.id : link.source.id);
            node.filter(d => linkedNodes.includes(d.id) && ![...Array(26).keys()].includes(d.id) && d.id !== 200)
                .classed("green-node", true);
        }

        simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(svgWidth / 2, window.innerHeight / 2))
        .force("x", d3.forceX().strength(0.01).x(d => Math.max(0, Math.min(svgWidth, d.x))))
        .force("y", d3.forceY().strength(0.01).y(d => Math.max(0, Math.min(window.innerHeight, d.y))))
        .alpha(1).restart();
    
        const nodeColor = d => colorScale(d.type);

        const link = svg.selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1);

        const drag = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        const node = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 7)
            .attr("fill", d => nodeColor(d))
            .call(drag)
            .classed("yellow-node", false)
            .classed("yellow-node", d => d.id === 1)
            .on("click", (event, d) => {
                if (d3.select(event.target).classed("yellow-node")) {
                    const imageUrl = `url("${d.imageUrl}")`;
                    d3.select("body").style("background-image", imageUrl)
                    .style("background-position", "30% 70%")
                    .style("background-size", "30% auto");
                  
                } else if (d3.select(event.target).classed("green-node")) {
                    const text = getTextForNode(nodes, d.id);
                    const type = getTypeForNode(nodes, d.id);
                    const position = { x: d.x, y: d.y };
                    showOverlay(text, type, position);
                } 
            node.append("title")
            .text(d => d.name)
        });
    
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

        const groupSelect = d3.select("#group-select")
            .attr("class", "search-bar");

        groupSelect.append("option")
            .attr("value", "") 
            .text("Sélectionnez un parcours");

        groupSelect.selectAll("option.group-option")
            .data(nodeGroups)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        groupSelect.append("option")
            .attr("value", "reset") 
            .text("Reset All");

        groupSelect.on("change", function() {
            const selectedGroup = d3.select(this).property("value");
            filterNodes(selectedGroup);
        });

        function filterNodes(selectedGroup) {
            if (selectedGroup === "reset") {
                node.attr("opacity", 1);
                link.attr("opacity", 1);
                return;
            }
            node.attr("opacity", d => (selectedGroup === "" || d.group === selectedGroup) ? 1 : 0.2);
            link.attr("opacity", d => (selectedGroup === "" || nodes[d.source.index].group === selectedGroup) ? 0 : 0.2);
        
        node.on("click", (event, d) => {
            if (d.group === selectedGroup) {
                // Display node information in overlay
                showOverlay(d.texte, d.type, {x: event.pageX, y: event.pageY}, d);   
                d3.select(event.target)
                .attr("fill", "gray");
            }
            
        });
        }


        document.addEventListener("click", function(event) {
            if (!event.target.closest("#overlayContent") && !event.target.closest("circle")) {
            hideOverlay();
        }
    });
});

function playPaper() {
    const music = document.getElementById("paper");
    paper.play();
}

function playTinkle() {
    const music = document.getElementById("tinkle");
    tinkle.play();
}

function showOverlay(text, type, position, targetNode) {
    const overlayContent = document.getElementById("overlayContent");
    overlayContent.innerHTML = `<p><h3>Fragment : <i>${type}</i></h3></p>` + text;
    const overlay = document.getElementById("overlay");
    const offsetTop = 0;
    const overlayTop = offsetTop;
    overlay.style.left = "1vw";
    overlay.style.top = overlayTop + "20vh";
    overlay.style.overflowY = "auto";  
    overlay.style.display = "block";
    overlay.scrollTop = 0;
} 

function hideOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    }

function getTextForNode(nodes, id) {
  const node = nodes.find(node => node.id === id);
  return node ? node.texte : "";
}
function getTypeForNode(nodes, id) {
    const node = nodes.find(node => node.id === id);
    return node ? node.type : "";
}

function getTitleForNode(nodes, id) {
    const node = nodes.find(node => node.id === id);
    return node ? node.name : "";
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        playTinkle();
}
    
function dragged(event, d) {
    d.fx = Math.max(0, Math.min(svgWidth, event.x));
    d.fy = Math.max(0, Math.min(svgHeight, event.y));
}
    
function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
}
