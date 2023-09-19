const demosArrays = require('../configs/demosArrays.json');

exports.automaticDemo = (req, res) => {
    
    var delay = req.body.delay;
    var demoRoute = req.body.demoRoute
    var currentDemoArray = [];
    var delayInMilliSeconds = (delay?.minutes * 60000) + (delay?.seconds * 1000) || 1000 // default 1s

    switch (demoRoute) {
        case "delivery-dispatch-management":
            currentDemoArray = demosArrays.dispatchOrderArray
            break;
        case "VehicleBooking":
            currentDemoArray = demosArrays.vehicleUrlArray
            break;
        case "VehicleInspectionDashboard":
            currentDemoArray = demosArrays.vehicleInspectionUrlArray
            break;
        case "FuelManagementDashbord":
            currentDemoArray = demosArrays.fuelManagementUrlArray
            break;
        case "ParkingManagement":
            currentDemoArray = demosArrays.parkingManagementUrlArray
            break;
        case "VehicleAccident":
            currentDemoArray = demosArrays.vehicleAccidentUrlArray
            break;
        case "Reports":
            currentDemoArray = demosArrays.reportsUrlArray
            break;
        case "ReplayPlayback":
            currentDemoArray = demosArrays.replayPlaybackUrlArray
            break;
        case "Dashboard":
            currentDemoArray = demosArrays.dashboardUrlArray
            break;
        case "IVMS":
            currentDemoArray = demosArrays.dashboardUrlIvmsArray
            break;
        case "DriverRanking":
            currentDemoArray = demosArrays.driverRankingArray
            break;
    
        default:
            break;
    }

    try {
        emitAutomaticDemo(demoRoute,currentDemoArray,delayInMilliSeconds)
        return res.status(200).json({
            result:true,
            message:"success"
          })
    } catch (error) {
        return res.status(500).json({
            result:false,
            message:error.message
        })
    }  
}

const emitAutomaticDemo = (eventName, urlArray,delay) => {
    console.log(`start ::: ${eventName} auto slidshow demo!`)
    urlArray.forEach((url, index) => {
      setTimeout(() => {
        io.sockets.emit(eventName, url);
      }, index * delay);
    });
}