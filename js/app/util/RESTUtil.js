
function RESTUtil() {}

RESTUtil.getAsyncData = function( url, actionSuccess, doneFunc, actionError ) 
{
	return $.ajax({
		type: "GET"
		,dataType: "json"
		,url: url
		,async: true
		,success: actionSuccess
		,error: actionError
	})
	.always( function( data ) {
		if ( doneFunc !== undefined ) doneFunc();
	});
}


RESTUtil.getSynchData = function( url ) {
	return $.ajax({
		type: "GET",
		dataType: "json",
		url: url,
		async: false
	}).responseText;
};


RESTUtil.submitPostAsyn = function( submitType, jsonData, url, actionSuccess, actionError, loadingStart, loadingEnd )
{			
	$.ajax({
		type: submitType
		,url: url
		,data: JSON.stringify( jsonData )
		,datatype: "json"
		,contentType: "application/json; charset=utf-8"
		,async: true
		,success: actionSuccess
		,error: actionError		
		,beforeSend: function( xhr ) {
			if ( loadingStart !== undefined ) loadingStart();
		}
	})
	.done( function( data ) {
		if ( loadingEnd !== undefined ) loadingEnd();
	});
}


// End of Data Retrieval Manager Class
// ------------------------------------------------------------
