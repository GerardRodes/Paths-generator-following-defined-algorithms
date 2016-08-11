var checkAndBuild = function(e){
	var rows = document.getElementById('rows'),
			cols = document.getElementById('cols')

	if (testInput(rows,isNumber) && testInput(cols,isNumber)) {
		genMaze(buildTable(rows.value,cols.value,document.getElementById('maze')))
	}
}
document.getElementById('generate').addEventListener('click', checkAndBuild)
document.getElementById('rows').addEventListener('keydown', function(e){ if (e.keyCode == 13) checkAndBuild() })
document.getElementById('cols').addEventListener('keydown', function(e){ if (e.keyCode == 13) checkAndBuild() })



var option = null,
		select	= document.getElementById('path')

select.addEventListener('change',function(e){ paths.selected = this.value })

Object.keys(paths)
			.forEach(function(key,index) {
					if (typeof paths[key] == 'function') {
						option = document.createElement("option")
						option.text = key
						select.add(option)
					}
				})

paths.selected = select[0].value