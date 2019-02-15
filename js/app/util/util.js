
// -------------------------------------------
// -- Utility Class/Methods

function Util() {}

Util.disableTag = function( tag, isDisable )
{
	tag.prop('disabled', isDisable);
	
	for( var i=0; i<tag.length; i++ )
	{
		var element = $(tag[i]);
		if( element.prop("tagName") == 'SELECT' || element.prop("tagName") == 'INPUT' )
		{
			if( isDisable )
			{
				element.css( 'background-color', '#F2F2F2' ).css( 'cursor', 'auto' );
			}
			else
			{
				element.css( 'background-color', 'white' ).css( 'cursor', '' );
			}
		}
	}
};


function Util() {}

Util.findItemValueFromList = function( listData, searchProperty, searchValue )
{
	var foundValue;

	$.each( listData, function( i, item )
	{
		if ( item[ searchProperty ] == searchValue )
		{
			foundValue = item.value;
			return foundValue;
		}
	});

	return foundValue;
};


Util.addItemToList = function( listData, searchProperty, replacedData )
{
	var found = false;
	$.each( listData, function( i, item )
	{
		if ( item[ searchProperty ] == replacedData[searchProperty] )
		{
			listData[i] = JSON.parse( JSON.stringify( replacedData ) );
			found = true;
			return false;
		}
	});

	if( !found )
	{
		listData[listData.length] = replacedData;
	}

};

// ----------------------------------
// FORM

Util.disableTag = function( tag, disabled )
{
	tag.prop( 'disabled', disabled );
	
	for( var i=0; i<tag.length; i++ )
	{
		var element = $(tag[i]);
		if( element.prop( "tagName" ) == 'SELECT' || element.prop( "tagName" ) == 'INPUT' )
		{
			if( disabled )
			{
				element.css( 'background-color', '#FAFAFA' ).css( 'cursor', 'auto' );
				if( element.prop( "tagName" ) == 'BUTTON' && element.find("span").length > 0  )
				{
					element.find("span").css( 'color', 'gray' );
				}
				else
				{
					element.css( 'color', 'gray' );
				}
			}
			else
			{
				element.css( 'background-color', 'white' ).css( 'cursor', '' ).css( 'color', '' );
				if( element.prop( "tagName" ) == 'BUTTON' && element.find("span").length > 0  )
				{
					element.find("span").css( 'color', '' );
				}
			}
		}
	}
};


// ----------------------------------
// Check Variable Related


Util.checkDefined = function( input ) {

	if( input !== undefined && input != null ) return true;
	else return false;
};

Util.checkValue = function( input ) {

	if ( Util.checkDefined( input ) && input.length > 0 ) return true;
	else return false;
};

Util.sortByKey = function( array, key ) {
	return array.sort( function( a, b ) {
		var x = a[key]; var y = b[key];
		return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
	});
};


// ----------------------------------
// DATE

// @params dateStr 2019-01-29T05:39:45.000
// @return 2019-01-29T05:39:45
Util.formatDateTime = function( dateStr )
{
	var formatDateTime = dateStr.substring( 0, 19 );
	return formatDateTime;
};

// @params dateStr 2019-01-29T05:39:45.000
// @return 2019-01-29
Util.formartDate = function( dateStr )
{
	var formatDateTime = dateStr.substring( 0, 10 );
	return formatDateTime;
};


Util.dateFormat = "yy-mm-dd";
Util.datePicker_SetDateRange = function( startDateTag, endDateTag )
{
	startDateTag.datepicker({
          defaultDate: "+1w",
		  dateFormat: Util.dateFormat,
          changeMonth: true,
          changeYear: true
        })
        .on( "change", function() {
          endDateTag.datepicker( "option", "minDate", Util.getDate( this ) );
        });

      endDateTag.datepicker({
        defaultDate: "+1w",
		dateFormat: Util.dateFormat,
        changeMonth: true,
        changeYear: true
      })
      .on( "change", function() {
        startDateTag.datepicker( "option", "maxDate", Util.getDate( this ) );
      });
 
};
      
Util.getDate = function( element )  
{
      var date;
      try {
        date = $.datepicker.parseDate( Util.dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
 
      return date;
};
