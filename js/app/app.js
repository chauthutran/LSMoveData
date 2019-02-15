
jQuery( document ).ready( function() {

	// Preload some processes and start FormAction class (the main class)
	//var preloadProcessorManager = new PreloadProcessManager( function( period_UI, orgUnit_DM ) {};

	var app = new App();		

});

function App()
{
	var me = this;

	me._queryURL_api = "../../../api/";
	me.programId = "KDgzpKX3h2S";
	me.stageId_Testing = "lVglvBnE3TY";
	me.stageId_ContactLog = "gmBozy0KAMC";
	me.stageId_ARTOpening = "OSpZnLBMVhr";
	me.stageId_ARTClosure = "usEIFQODMxf";
	me.stageId_PrePRefOpening = "R5UixJ6WEAn";
	me.stageId_PrePRefClosure = "aiTsagZHFeV";


	me.URL_PARAM_PROGRAM_STARTDATE = "URL_PARAM_PROGRAM_STARTDATE";
	me.URL_PARAM_PROGRAM_ENDDATE = "URL_PARAM_PROGRAM_ENDDATE";
	me.URL_PARAM_TEIID = "URL_PARAM_TEIID";


	me._queryUrl_retrieveUsernames = me._queryURL_api + "categories/qVl8p3w3fI5.json?fields=categoryOptions[id,name,code]";
	// Get all TrackedEntityInstances from StartDate to EndDate
	me._queryUrl_retrieveTEIs = me._queryURL_api + "trackedEntityInstances.json?programStartDate=" + me.URL_PARAM_PROGRAM_STARTDATE + "&programEndDate=" + me.URL_PARAM_PROGRAM_ENDDATE + "&program=" + me.programId + "&ouMode=ALL&skipPaging=true";
	me._queryUrl_retrieveEventsByTEI = me._queryURL_api + "events.json?trackedEntityInstance=" + me.URL_PARAM_TEIID + "&sortOrder=eventDate:DESC&skipPaging=true&program=" + me.programId;
	me._queryUrl_updateTEIs = me._queryURL_api + "trackedEntityInstances/" + me.URL_PARAM_TEIID;

	
	// -----Tags --------------------

	// Option parametters FORM
	me.paramFormTag = $("#paramForm");
	me.startDateTag = $( "#startDate" );
	me.endDateTag = $( "#endDate" );
	me.executeBtnTag = $("#executeBtn");
	me.stopBtnTag = $("#stopBtn");

	// Loading
	me.processingDivTag = $("#processingDiv");
	me.spanProgressMsgTag = $("#spanProgressMsg");

	// RESULT 
	me.resultDetailsTag = $("#resultDetails");
	me.resultTotalClientsTag = $("#resultTotalClients");
	me.noRecordsSuccessedTag = $("#noRecordsSuccessed");
	me.noRecordsFailedTag = $("#noRecordsfailed");
	me.failedRecordsDetailsTag = $("#failedRecordsDetails");

	// STOP
	me.stoppedRecordsDetailsTag = $("#stoppedRecordsDetails");
	me.stoppedRecordNoTag = $("#stoppedRecordNo");
	me.stoppedRecordsStartDateTag = $("#stoppedRecordsStartDate");
	me.stoppedRecordsEndDate = $("#stoppedRecordsEndDate");

	me.usernameList = [];

	me.teiList = [];
	me.totalTEICount = 0;
	me.resultCount_Processed = 0;
	me.resultCount_Successed = 0;
	me.resultCount_FailureClients = [];
	me.stopClicked = false;

	// -------------  Data Element UID ----------------

	me.de_HIVTestFinalResult = "UuKat0HFjWS";
	me.de_HIVEventParnerCUIC = "UYyCL2xz8Wz";

	// [Contact Log Event] attributes
	me.de_ContactLogEvent_LastAction = "wzM3bUiPowS";
	me.de_ContactLogEvent_NextAction = "mcgzEFh5IV8";
	me.de_ContactLogEvent_NextActionDate = "HcBFZsCt8Sy";


	// -------------  Attribute UID ----------------

	// [HIV Test Final result EVENT] Attributes
	me.attr_HIVTestFinalResult = "PoTcUsGrIbS";
	me.attr_HIVEventDate = "AcpKX4a2iAx";
	me.attr_HIVEventStatus = "JAMoB6GnGyw";
	me.attr_HIVEventCatOpt = "hkf4GS79Sul";
	me.attr_HIVEventNo = "Y1pdU5TSGrB";
	me.attr_HIVEventOrgUnit = "uXg5tqrRsXJ";
	me.attr_HIVEventParnerOption = "HJQvtlJOmQm";
	me.attr_HIVEventParnerCUIC = "s192aFpfWbW";

	// [Contact Log Event] attributes
	me.attr_ContactLogEvent_LastAction = "jWl3jWdsogC";
	me.attr_ContactLogEvent_LastActionDate = "L5NZ7vuyLe7";
	me.attr_ContactLogEvent_NextAction = "kIREHjvNqNe";
	me.attr_ContactLogEvent_Usernames = "L9SC2lA8eWg";
	
	
	// [ART Opening] attributes
	me.attr_ARTOpening_EventDate = "OqrP3KFlFT1";
	me.attr_ARTOpening_Facility = "wLGxRN9x0uW";


	// [ART Closure] attributes
	me.attr_ARTClosure_EventDate = "D7CpzDGAPpy";
	me.attr_ARTClosure_Usernames = "YhfhMtu82Pr";


	// [PrEP Refer. Opening] attributes
	me.attr_PrEPRefer_EventDate = "xvXK3b9PJRT";
	me.attr_PrEPRefer_Facility = "Q57XfdQD146";
	
	// [PrEP Refer. Closure] attributes
	me.attr_PrEPReferClosure_EventDate = "N0Dry7xDF9P";
	me.attr_PrEPReferClosure_Usernames = "neSEKfn7J76";


	// ==================================

	me.initialSetup = function()
	{
		// me.retrieve_Usernames();
		me.setup_Event();
	};

	// ==================================
	// === Event Related ================

	me.setup_Event = function()
	{
		me.executeBtnTag.click( function() {
			me.run();
		});

		Util.datePicker_SetDateRange( me.startDateTag, me.endDateTag );

		// me.loadedDataResetBtnTag.click( function() {
		// 	me.loadedVoucherList = undefined;
		// 	alert( 'Loaded Data Removed' );
		// });

		me.stopBtnTag.click( function() {
			me.stopClicked = true;
		});

		// // 'startFromTag' and 'startFromTimeStampTag' should not have value same time.
		// me.startFromTag.change( function() {

		// 	var val = $.trim( $( this ).val() );

		// 	if ( val ) me.startFromTimeStampTag.val( '' );
		// });

		// me.startFromTimeStampTag.change( function() {

		// 	var val = $.trim( $( this ).val() );

		// 	if ( val ) me.startFromTag.val( '' );
		// });
	};
	
	// ==================================
	// === EXECUTE METHOD ===============

	me.run = function()
	{
		me.disalbeForm( true );

		
		me.teiList = [];
		me.totalTEICount = 0;
		me.resultCount_Processed = 0;
		me.resultCount_Successed = 0;
		me.resultCount_FailureClients = [];


		var startDate = me.startDateTag.val();
		var endDate = me.endDateTag.val();
		me.stopClicked = false;
		me.retrieve_TEIs( startDate, endDate );
	};


	// ==================================
	// == RETRIEVE DATA  ===============


	me.retrieve_Usernames = function()
	{
		var queryUrl = me._queryUrl_retrieveUsernames;

		RESTUtil.getAsyncData( queryUrl
			, function( jsonDate ){ // success
				me.usernameList = jsonDate.categoryOptions;
			}, function(){

			}, function(){
				MsgManager.appBlock( "Initializing ..." ) ;
			}, function(){
				MsgManager.appUnBblock() ;
			});
	};

	me.retrieve_TEIs = function( startDate, endDate )
	{
		me.resultDetailsTag.hide();
		me.setProcessigMessage("Retreiving clients ... " );

		var queryUrl = me._queryUrl_retrieveTEIs;
		queryUrl = queryUrl.replace( me.URL_PARAM_PROGRAM_STARTDATE, startDate );
		queryUrl = queryUrl.replace( me.URL_PARAM_PROGRAM_ENDDATE, endDate );

		RESTUtil.getAsyncData( queryUrl
			, function( jsonDate ){ // success

				var jsonTEIs = jsonDate.trackedEntityInstances;
				Util.sortByKey( jsonTEIs, "created" );

				me.teiList = jsonTEIs;
				me.totalTEICount = jsonTEIs.length;
				me.resultCount_Processed = 0;
				me.resultCount_Successed = 0;
				me.resultCount_FailureClients = [];

				for( var i=0; i<jsonTEIs.length; i++ )
				{
					if( !me.stopClicked )
					{
						me.addAndUpdateAttributeValues( jsonTEIs[i] );
					}
					else
					{
						me.afterUpdatedData();
					}
				}
				
			}, function(){
				me.setProcessigMessage( "Starting updating data ..." );
				if( me.stopClicked )
				{
					me.afterUpdatedData();
				}

			} , function(){
				me.processingDivTag.hide();
				me.afterUpdatedData();
			});
	};

	
	// ==================================
	// After Updating TEIs methods

	me.afterUpdatedData = function( successed )
	{
		me.setProcessigMessage( "Updated " + me.resultCount_Processed + "/" + me.totalTEICount + "clients" );

		if( me.resultCount_Processed == me.totalTEICount || me.stopClicked )
		{
			var noFailed = me.resultCount_FailureClients.length;

			me.resultTotalClientsTag.html( me.totalTEICount );
			me.noRecordsSuccessedTag.html( me.resultCount_Successed );
			me.noRecordsFailedTag.html( noFailed );
			me.populateFailedClients();

			// For "stop" infornation
			if( me.stopClicked )
			{
				var stoppedClients = me.teiList.slice( me.resultCount_Processed, me.totalTEICount);
				if( stoppedClients.length > 0 )
				{
					var stoppedRecordsStartDate = Util.formartDate( stoppedClients[0].created );
					var stoppedRecordsEndDate = Util.formartDate( stoppedClients[ stoppedClients.length - 1 ].created );

					me.stoppedRecordNoTag.html( stoppedClients.length );
					me.stoppedRecordsStartDateTag.html( stoppedRecordsStartDate );
					me.stoppedRecordsEndDate.html( stoppedRecordsEndDate );

					me.stoppedRecordsDetailsTag.show();
				}
				else
				{
					me.stoppedRecordsDetailsTag.hide();
				}
			}

			me.resultDetailsTag.show();
			me.processingDivTag.hide();
			me.disalbeForm( false );
		}
		
	};

	me.populateFailedClients = function()
	{
		me.failedRecordsDetailsTag.find("tbody").find("tr").remove();
		var noFailed = me.resultCount_FailureClients.length;
		if( noFailed > 0 )
		{
			var tbody = me.failedRecordsDetailsTag.find("tbody");
			for( var i=0; i<noFailed; i++ )
			{
				var teiData = me.resultCount_FailureClients[i];
				var conflictsData = me.populateErrorUpdateTEiDetails( teiData.conflicts );
				var rowTag = $("<tr></tr>");
				rowTag.append( "<td>" + teiData.trackedEntityInstance + "</td>" );
				rowTag.append( "<td>" + Util.formartDate( teiData.created ) + "</td>" );
				rowTag.append( "<td>" + conflictsData + "</td>" );
				tbody.append( rowTag );
			}

			me.failedRecordsDetailsTag.show();
		}
		else
		{
			me.failedRecordsDetailsTag.hide();
		}
	};

	me.populateErrorUpdateTEiDetails = function( errorConflicts )
	{
		var errorMessage = "";
		for( var i=0; i<errorConflicts.length; i++ )
		{
			errorMessage += errorConflicts[i].value + "</br>";
		}

		return errorMessage;
	};


	
	// == UPDATE DATA  ==================

	me.addAndUpdateAttributeValues = function( jsonTEI )
	{
		var teiId = jsonTEI.trackedEntityInstance;

		var queryUrl = me._queryUrl_retrieveEventsByTEI;
		queryUrl = queryUrl.replace( me.URL_PARAM_TEIID, teiId );

		RESTUtil.getAsyncData( queryUrl
			, function( jsonDate ){ // success

				var eventList = jsonDate.events;
				jsonTEI = me.addAttributeValues_ForTestingEvent( jsonTEI, eventList );
				jsonTEI = me.addAttributeValues_ForContactLogEvent( jsonTEI, eventList );
				jsonTEI = me.addAttributeValues_FoARTOpeningEvent( jsonTEI, eventList );
				jsonTEI = me.addAttributeValues_FoARTClosureEvent( jsonTEI, eventList );
				jsonTEI = me.addAttributeValues_PreReferOpeningEvent( jsonTEI, eventList );
				jsonTEI = me.addAttributeValues_FoPreReferClosureEvent( jsonTEI, eventList );

				if( !me.stopClicked )
				{
					me.updateAttributeValue( jsonTEI );
				}
				else
				{
					me.afterUpdatedData();
				}
			}, function(){ // done
				
			} , function( e ){ // error
				jsonTEI.conflicts =[{
					"value": "Faild to load events."
				}];
				me.resultCount_FailureClients.push( jsonTEI );
				me.afterUpdatedData();
			});
	};

	me.addAttributeToTEI = function( jsonTEI, attrId, value )
	{
		var attrValueData = {
			"attribute": attrId,
			"value": value
		};
		Util.addItemToList( jsonTEI.attributes, "attribute", attrValueData );
	};

	me.addAttributeValues_ForTestingEvent = function( jsonTEI, eventList )
	{
		var events = me.findEvents( eventList, me.stageId_Testing );
		if( events.length > 0 )
		{
			var dataValues = events[0].dataValues;

			// Get data from the latest event
			var finalResult = Util.findItemValueFromList ( dataValues, "dataElement", me.de_HIVTestFinalResult );
			var parnerCUIC =  Util.findItemValueFromList ( dataValues, "dataElement", me.de_HIVEventParnerCUIC );
			var eventDate = events[0].eventDate;
			var eventStatus = events[0].status;
			var eventNo = events.length;
			var eventOrgUnit = events[0].orgUnit + "$" + events[0].orgUnitName;
			var eventCatOpt = events[0].attributeCategoryOptions;

			// Set attribute values for TEI
			me.addAttributeToTEI( jsonTEI, me.attr_HIVTestFinalResult, finalResult );
			me.addAttributeToTEI( jsonTEI, me.attr_HIVEventDate, Util.formatDateTime( eventDate ) );
			me.addAttributeToTEI( jsonTEI, me.attr_HIVEventStatus, eventStatus );
			me.addAttributeToTEI( jsonTEI, me.attr_HIVEventCatOpt, eventCatOpt );
			me.addAttributeToTEI( jsonTEI, me.attr_HIVEventNo, eventNo );
			me.addAttributeToTEI( jsonTEI, me.attr_HIVEventOrgUnit, eventOrgUnit );
			me.addAttributeToTEI( jsonTEI, me.attr_HIVTestFinalResult, finalResult );
			
			if( parnerCUIC !== undefined )
			{
				me.addAttributeToTEI( jsonTEI, me.attr_HIVEventParnerCUIC, parnerCUIC );
			}
		}

		return jsonTEI;
	};

	me.addAttributeValues_ForContactLogEvent = function( jsonTEI, eventList )
	{
		var events = me.findEvents( eventList, me.stageId_ContactLog );
		if( events.length > 0 )
		{
			var latestEvent = events[0];
			var dataValues = latestEvent.dataValues;

			var lastAction = Util.findItemValueFromList ( dataValues, "dataElement", me.de_ContactLogEvent_LastAction );
			var lastActionDate = Util.formatDateTime( latestEvent.eventDate );
			var nextAction = Util.findItemValueFromList ( dataValues, "dataElement", me.de_ContactLogEvent_NextAction );
			var nextActionDate = Util.findItemValueFromList ( dataValues, "dataElement", me.de_ContactLogEvent_NextActionDate );
			// var usernameList = Util.findItemValueFromList ( me.usernameList, "dataElement", me.de_ContactLogEvent_NextActionDate );
			var usernameList = latestEvent.attributeCategoryOptions;

			for( var i=1; i<events.length; i++ )
			{
				usernameList += ";" + events[i].attributeCategoryOptions;
			}


			// Set attribute values for TEI
			me.addAttributeToTEI( jsonTEI, me.attr_ContactLogEvent_LastAction, lastAction );
			me.addAttributeToTEI( jsonTEI, me.attr_ContactLogEvent_LastActionDate, Util.formatDateTime( latestEvent.eventDate ) );
			me.addAttributeToTEI( jsonTEI, me.attr_ContactLogEvent_NextAction, nextAction );
			me.addAttributeToTEI( jsonTEI, me.attr_ContactLogEvent_Usernames, usernameList );
		}

		return jsonTEI;

	};

	me.addAttributeValues_FoARTOpeningEvent = function( jsonTEI, eventList )
	{
		var events = me.findEvents( eventList, me.stageId_ARTOpening );
		if( events.length > 0 )
		{
			// Set attribute values for TEI
			var eventOrgUnit = events[0].orgUnit + "$" + events[0].orgUnitName;

			me.addAttributeToTEI( jsonTEI, me.attr_ARTOpening_EventDate, Util.formatDateTime( events[0].eventDate ) );
			me.addAttributeToTEI( jsonTEI, me.attr_ARTClosure_Usernames, eventOrgUnit );
		}

		return jsonTEI;
		
	};

	me.addAttributeValues_FoARTClosureEvent = function( jsonTEI, eventList )
	{
		var events = me.findEvents( eventList, me.stageId_ARTClosure );
		if( events.length > 0 )
		{
			// Set attribute values for TEI
			me.addAttributeToTEI( jsonTEI, me.attr_ARTClosure_EventDate, Util.formatDateTime( events[0].eventDate ) );
			me.addAttributeToTEI( jsonTEI, me.attr_ARTClosure_Usernames, events[0].attributeCategoryOptions );
		}

		return jsonTEI;
	};

	me.addAttributeValues_PreReferOpeningEvent = function( jsonTEI, eventList )
	{
		var events = me.findEvents( eventList, me.stageId_PrePRefOpening );
		if( events.length > 0 )
		{
			// Set attribute values for TEI
			var eventOrgUnit = events[0].orgUnit + "$" + events[0].orgUnitName;

			me.addAttributeToTEI( jsonTEI, me.attr_PrEPRefer_EventDate, Util.formatDateTime( events[0].eventDate ) );
			me.addAttributeToTEI( jsonTEI, me.attr_PrEPRefer_Facility, eventOrgUnit );
		}

		return jsonTEI;
		
	};

	me.addAttributeValues_FoPreReferClosureEvent = function( jsonTEI, eventList )
	{
		var events = me.findEvents( eventList, me.stageId_PrePRefClosure );
		if( events.length > 0 )
		{
			// Set attribute values for TE

			me.addAttributeToTEI( jsonTEI, me.attr_PrEPReferClosure_EventDate, Util.formatDateTime( events[0].eventDate ) );
			me.addAttributeToTEI( jsonTEI, me.attr_PrEPReferClosure_Usernames, events[0].attributeCategoryOptions );
		}

		return jsonTEI;
		
	};

	me.updateAttributeValue = function( jsonTEI )
	{
		var queryUrl = me._queryUrl_updateTEIs;
		queryUrl = queryUrl.replace( me.URL_PARAM_TEIID, jsonTEI.trackedEntityInstance );

		RESTUtil.submitPostAsyn( "PUT", jsonTEI, queryUrl
			, function(){ // Success
				me.resultCount_Successed++;
				me.resultCount_Processed++;

				me.afterUpdatedData();
			}, function( e ){ // fail
				me.resultCount_Processed++;

				var conflicts = JSON.parse( e.responseText ).response.conflicts;
				jsonTEI.conflicts = conflicts;
				me.resultCount_FailureClients.push( jsonTEI );

				me.afterUpdatedData();
			} );
	};

	// ======================================
	// == SUPPORTIVE METHODS  ===============

	me.findEvents = function( eventList, stageId )
	{
		var foundEvents = [];
		for( var i=0; i<eventList.length; i++ )
		{
			if( eventList[i].programStage === stageId )
			{
				foundEvents.push( eventList[i] );
			}
		}

		return foundEvents;
	};

	me.countEvents = function( eventList, stageId )
	{
		var count = 0;
		for( var i=0; i<eventList.length; i++ )
		{
			if( eventList[i].programStage === stageId )
			{
				count++;
			}
		}

		return count;
	};

	me.disalbeForm = function( disabled )
	{
		Util.disableTag( me.startDateTag, disabled );
		Util.disableTag( me.endDateTag, disabled );
		Util.disableTag( me.executeBtnTag, disabled );
	};

	me.setProcessigMessage = function( message )
	{
		me.processingDivTag.show();
		me.spanProgressMsgTag.html( message );
	};

	// ==================================
	// === INITIALIZE METHOD ===============

	me.initialSetup();	

}


