// Simple SVG drawing tool: user draws freehand lines by dragging mouse
window.addEventListener('DOMContentLoaded', function () {
    var svg = document.getElementById('drawArea');

    var isDrawing = false; // are we currently drawing?
    var currentPath = null; // the active <path> element
    var points = []; // collected points for the active line

    // Helper: get mouse position relative to SVG coordinate system
    function getPoint(evt) {
        var rect = svg.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        return { x: x, y: y };
    }

    // Start drawing new path on mousedown
    svg.addEventListener('mousedown', function (evt) {
        isDrawing = true;
        points = []; // reset points
        var p = getPoint(evt);
        points.push(p);

        // Create a new path element
        currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        currentPath.setAttribute('class', 'line');
        currentPath.setAttribute('d', 'M ' + p.x + ' ' + p.y); // move to first point
        svg.appendChild(currentPath);
    });

    // While mouse moves and drawing is active, extend the path
    svg.addEventListener('mousemove', function (evt) {
        if (!isDrawing || !currentPath) return;
        var p = getPoint(evt);
        points.push(p);

        // Build a path string with line segments to each point
        var d = 'M ' + points[0].x + ' ' + points[0].y;
        for (var i = 1; i < points.length; i++) {
            d += ' L ' + points[i].x + ' ' + points[i].y;
        }
        currentPath.setAttribute('d', d);
    });

    // Finish line on mouseup or mouseleave (when cursor leaves svg)
    function endDrawing() {
        if (isDrawing) {
            isDrawing = false;
            currentPath = null;
            points = [];
        }
    }

    svg.addEventListener('mouseup', endDrawing);
    svg.addEventListener('mouseleave', endDrawing);
});
