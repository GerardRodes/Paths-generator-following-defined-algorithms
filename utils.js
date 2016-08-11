
//returns true if number
var isNumber = function (num){
	return !isNaN(num) && num != null && num != undefined && num != ''
}

//returns true if elem.value returns true throught test()
//also adds error/correct clases to the element when necessary
var testInput = function (elem,test){
	if (!test(elem.value)) {
		if (!elem.classList.contains('error')) {
			elem.classList.add('error')
		}
		return false
	} else {
		if (elem.classList.contains('error')) {
			elem.classList.remove('error')
		}
		if (!elem.classList.contains('correct')) {
			elem.classList.add('correct')
		}
		return true
	}
}

//Builds table element and prints html into container element parameter or body
var buildTable = function(rows,cols,container){
	container = container || document.getElementsByTagName('body')[0]

	var table = document.createElement("TABLE"),
			row = null,
			cell = null,
			containerHeight = container.style.width != '' ? container.style.width : window.getComputedStyle(container).getPropertyValue('width').replace('px',''),
			cellHeight =  containerHeight / cols,
			borderWidth = cellHeight * .2

	table.setAttribute("id", "procedure-table-maze")
	for(var iRow = 0; iRow < rows; iRow++){
		row = table.insertRow(iRow)
		for(var iCell = 0; iCell < cols; iCell++){
			cell = row.insertCell(iCell)
			cell.className = 'cell'

			cell.style.borderWidth = borderWidth + 'px'
			cell.style.height = cellHeight + 'px'
			cell.dataset.x = iCell
			cell.dataset.y = iRow
			cell.dataset.visited = 'false'
		}
	}

	container.innerHTML = table.outerHTML

	return table;
}

//Reads paths and follows them through the table
//updating it until it finish
var genMaze = function(table){
	var nRows 	= table.rows.length,
			nCols 	= table.rows[0].cells.length,
			nCells 	= nRows * nCols,
			vCells	= 0, //Visited Cells
			element = document.getElementById(table.getAttribute('id')),
			cell 		= {
				x:0,
				y:0,
				getCell: function(){
					return element.rows[parseInt(cell.y)].cells[parseInt(cell.x)]
				},
				getTopCell: function(){
					return cell.y > 0 ? element.rows[parseInt(cell.y) - 1].cells[parseInt(cell.x)] : false
				},
				getBottomCell: function(){
					return cell.y < nRows - 1 ? element.rows[parseInt(cell.y) + 1].cells[parseInt(cell.x)] : false
				},
				getLeftCell: function(){
					return cell.x > 0 ? element.rows[parseInt(cell.y)].cells[parseInt(cell.x) - 1] : false
				},
				getRightCell: function(){
					return cell.x < nCols - 1 ? element.rows[parseInt(cell.y)].cells[parseInt(cell.x) + 1] : false
				},
				move: function(direction){
					var func 			= null,
							side			= null,
							nextCell 	= null

					switch(direction){
						case 'top':
							nextCell = cell.getTopCell()
							side = "borderTopStyle"
							break;
						case 'bottom':
							nextCell = cell.getBottomCell()
							side = "borderBottomStyle"
							break;
						case 'right':
							nextCell = cell.getRightCell()
							side = "borderRightStyle"
							break;
						case 'left':
							nextCell = cell.getLeftCell()
							side = "borderLeftStyle"
							break;
						default:
							return false
					}

					if (nextCell && nextCell.dataset.visited == 'false') {
						//Open wall
						cell.getCell().style[side] = 'hidden'

						//Become new cell
						cell.x = parseInt(nextCell.dataset.x)
						cell.y = parseInt(nextCell.dataset.y)

						paths.lastMove = direction
						//active new cell
						return cell.active()
					} else {
						return false
					}

				},
				isActive: function(customCell,returnMe){
					returnMe = (returnMe == undefined) ? false : returnMe

					if (customCell == undefined) {
						return cell.getCell().dataset.visited == 'true'
					} else if(customCell != false) {
						return customCell.dataset.visited == 'true'
					} else {
						return returnMe
					}
				},
				active: function(){
					if (!cell.isActive()) {
						cell.getCell().dataset.visited = 'true'
						vCells++
						return true
					} else {
						return false
					}
				}
			},
			explore = function(){
				if(vCells < nCells){
					paths[paths.selected](cell)
					requestAnimationFrame(explore)
				}
			}
	console.log(paths.selected)
	cell.active()
	explore()
}



//Paths to follow
var paths = {
	lastMove: 'right',
	selected: null,
	snailShell: function(cell){

		if (cell.move(paths.lastMove)) {
		} else if (cell.move('right')) {
		} else if (cell.move('bottom')) {
		} else if (cell.move('left')) {
		} else if (cell.move('top')) {
		} else {
			vCells = nCells
		}

	},
	justFill: function(cell){

		if (cell.move('right')) {
		} else if (cell.move('left')) {
		} else if (cell.move('bottom')) {
		} else if (cell.move('top')) {
		} else {
			vCells = nCells
		}
	},
	random: function(cell){
		switch(Math.floor(Math.random()*(4)+1)){
			case 1:
				cell.move('right')
				break;
			case 2:
				cell.move('left')
				break;
			case 3:
				cell.move('top')
				break;
			case 4:
				cell.move('bottom')
				break;
		}
	},
	randomNoRepeat: function(cell){
		var direction = null

		switch(Math.floor(Math.random()*(4)+1)){
			case 1:
				direction = 'right'
				break;
			case 2:
				direction = 'left'
				break;
			case 3:
				direction = 'top'
				break;
			case 4:
				direction = 'bottom'
				break;
		}

		if (direction != paths.lastMove) {
			cell.move(direction)
		} else {
			paths.random(cell)
		}
	}
}