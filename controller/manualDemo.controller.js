const demosArrays = require('../configs/demosArrays.json');

var currentIndex = 0;

exports.manualDemoReset = async (req, res) => {
    currentIndex = 0;
    return res.status(200).json({
        result:true,
        message:'success'
    });
};

exports.manualDemoNext = async (req, res) => {
    let demoRoute = req.body.demoRoute
    
    try {

        let currentDemoArray = [];
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

        // if there are no more elements
        if (currentIndex >= currentDemoArray.length) {

            return res.status(200).json({
                result:true,
                message:"No more elements available",
                url:currentDemoArray[currentDemoArray.length - 1],
                currentIndex 
            });
        }

        nextElement = currentDemoArray[currentIndex];
        currentIndex++;

        return res.status(200).json({
            result:true,
            message:"success",
            url: nextElement,
            currentIndex
        });
            
    } catch (error) {
        res.status(500).json({
            result:false,
            message:error.message
        })
    }
}
exports.manualDemoPrev = async (req, res) => {
    try {
        let demoRoute = req.body.demoRoute
        

        let currentDemoArray = [];

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

        if ((currentIndex - 1) <= 0) {
            // if already at the first element
            return res.status(200).json({
                result:true,
                message:"Already at the first element",
                url:currentDemoArray[0],
                currentIndex
            })
        }

        currentIndex--;
        const prevElement = currentDemoArray[currentIndex - 1];

        return res.status(200).json({
            result:true,
            message:"success",
            url:prevElement,
            currentIndex
        })


    } catch (error) {
        res.status(500).json({
            result:false,
            message:error.message
        })
    }
}
