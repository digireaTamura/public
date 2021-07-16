//save file 
function saveCanvas(canvas_id)
{
	var canvas_download = document.getElementById(canvas_id);

    var a = document.createElement('a');
	a.href = canvas_download.toDataURL('image/jpg', 0.85);
	a.download = 'canvas.jpg';
	a.click();
    console.log("OK");
}