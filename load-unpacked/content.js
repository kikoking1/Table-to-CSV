function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}

function is_salesforce_query_editor_grid() {
	if (document.querySelector('.x-grid-header-ct') != null) {
		return true;
	}
	return false;
}

// evt.target
// Turn html table to downloadable csv. Modified from stack overflow answer - https://stackoverflow.com/questions/15547198/export-html-table-to-csv#answer-56370447
function download_table_as_csv(table_elm) {
    // Select rows from table_id
	var firstRow = true;
    var rows = table_elm.querySelectorAll('tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {

        var row = [];
		var cols = rows[i].querySelectorAll('td, th');

		if (is_salesforce_query_editor_grid() && firstRow) { // salesforce query editor support
			var queryGridHeaderRowElm = document.querySelector('.x-grid-header-ct');
			cols = queryGridHeaderRowElm.querySelectorAll('.x-column-header-text');
		}

        for (var j = 0; j < cols.length; j++) {

            // add support for inner input tags in tables.
            var colText = '';
            if (cols[j].querySelector('input') != null) {
              colText = cols[j].querySelector('input').value;
            } else if (cols[j].querySelector('select') != null) {
              colText = cols[j].querySelector('select').value;
            } else if (cols[j].querySelector('textarea') != null) {
              colText = cols[j].querySelector('textarea').innerText;
            } else{
              colText = cols[j].innerText;
            }

            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = colText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(','));
		firstRow = false;
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'export_table_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.ready(function() {

  const bodyElm = document.querySelectorAll('body');

    bodyElm[0].addEventListener("click", function(event) {
      // console.log(event.target.closest("table").tagName);
      try{
        const tableElmClicked = event.target.closest("table");
        if (tableElmClicked.tagName.toLowerCase() == 'table' && event.shiftKey) {
          download_table_as_csv(tableElmClicked);
        }
      } catch(e) {}
      
    });
  
});




