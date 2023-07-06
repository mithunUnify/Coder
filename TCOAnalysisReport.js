app.controller("ReportController", function ($scope, $http, sampleService) {
    $scope.NumberOfYearsText = "payasyougo";
    $scope.NumberOfYears = "1";
    $scope.years = sampleService.years;
    $scope.loader = true;
    sampleService.loader = true;
    $scope.$on('broadCastDataAgain', function (event, data) {
        console.API;
        $scope.NoData = false;
        if (typeof console._commandLineAPI !== 'undefined') {
            console.API = console._commandLineAPI; //chrome
        } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
            console.API = console._inspectorCommandLineAPI; //Safari
        } else if (typeof console.clear !== 'undefined') {
            console.API = console;
        }
        if (!CheckDataOnPremises(sampleService.ServerAssumptions)) {
            if (!CheckLiftShiftData(sampleService.ReconLiftandShift_InputData)) {
                $scope.LoadReport();
            }
            else {
                $scope.loader = false;
                $scope.errorMessage = "Lift Shift Data Not Available";
                $scope.NoData = true;
            }
        }
        else {
            $scope.loader = false;
            $scope.NoData = true;
        }
    });
    $scope.LoadReport = function () {
        $scope.ChangePricePerKiloWatt = function (elm) {
            sampleService.PricePerKiloWatt = elm.PricePerKiloWatt;
        };
        $http.post('TCOCalculator.aspx/GetAssumptions', { data: {} }).then(function (response) {
            $http.post('TCOCalculator.aspx/GetWorkLoads', { data: {} }).then(function (netres) {
                if (netres.data.d.CurrencyValue == "No") {
                    var currencyname = netres.data.d.CurrencyName;
                    $("#MyPopupCurrency .modal-title").html("Cloud Recon");
                    $("#MyPopupCurrency .modal-body").html("<p style ='font-size: 14px;'> You have saved your TCO report in <b style= 'color: #ff897a; font-weight: bold;'>" + currencyname + "</b> Currency, If You want to see the report in another currency then select <b style= 'color: #ff897a; font-weight: bold;'>" + currencyname + "</b> Currency and reset your report </p>");
                    $("#MyPopupCurrency").modal("show");
                }
                else {
                    $scope.loader = sampleService.loader;
                    var TotalHardwareCost = 0;
                    var TotalSoftwareCost = 0;
                    var TotalElectricityCost = 0;
                    var requiredRacks = 0;


                    var HardwareConfig = [];
                    var SoftwareConfig = [];
                    var ElectricityConfig = [];
                    var DataCenterConfig = [];
                    var config = [];
                    var outputPrice = [];
                    $scope.PricePerKiloWatt = response.data.d.ElectricityCost_KW[0].Cost; sampleService.PricePerKiloWatt = $scope.PricePerKiloWatt;
                    sampleService.PricePerKiloWatt = $scope.PricePerKiloWatt;
                    $scope.DataCenterConstructionCost = {
                        constructionCost: response.data.d.DataCenterConstructionCost[0].RackUnitRequired,
                        Life: response.data.d.DataCenterConstructionCost[1].RackUnitRequired,
                        UnitsPerRack: response.data.d.DataCenterConstructionCost[2].RackUnitRequired
                    }; sampleService.DataCenterConstructionCost = $scope.DataCenterConstructionCost;
                    $scope.NetworkingCost = [
                        { Type: "Network hardware and software costs as a percentage of hardware and software costs (%)", Value: response.data.d.NetworkingCost[0].Cost, Unit: "Percentage", ID: 1 },
                        { Type: "Service provider cost/GB", Value: response.data.d.NetworkingCost[1].Cost, Unit: "Cost", ID: 2 },
                        { Type: "Network maintenance cost as a percentage of network hardware and software costs (%)", Value: response.data.d.NetworkingCost[2].Cost, Unit: "Percentage", ID: 3 }
                    ];
                    sampleService.NetworkingCost = $scope.NetworkingCost;
                    //$scope.MigrationObj = [{ Type: "MigrationObj", subItems: [{ value0: response.data.d.MigrationCost[0].Price }, { value1: response.data.d.MigrationCost[1].Price }, { value2: response.data.d.MigrationCost[2].Price }, { value3: response.data.d.MigrationCost[3].Price }, { value4: response.data.d.MigrationCost[4].Price }, { value5: response.data.d.MigrationCost[5].Price }] }];

                    var VMCount = netres.data.d.ReconLiftandShift_InputData.length;
                    if (VMCount < 1000) {
                        $scope.MigrationObj = [{
                            Type: "MigrationObj",
                            subItems: [
                                { value0: response.data.d.MigrationCost[0].VM_1_1000_Price },
                                { value1: response.data.d.MigrationCost[1].VM_1_1000_Price },
                                { value2: response.data.d.MigrationCost[2].VM_1_1000_Price },
                                { value3: response.data.d.MigrationCost[3].VM_1_1000_Price },
                                { value4: response.data.d.MigrationCost[4].VM_1_1000_Price }]
                        }];
                    }
                    else if (VMCount < 2000) {
                        $scope.MigrationObj = [{
                            Type: "MigrationObj",
                            subItems: [
                                { value0: response.data.d.MigrationCost[0].VM_1000_2000_Price },
                                { value1: response.data.d.MigrationCost[1].VM_1000_2000_Price },
                                { value2: response.data.d.MigrationCost[2].VM_1000_2000_Price },
                                { value3: response.data.d.MigrationCost[3].VM_1000_2000_Price },
                                { value4: response.data.d.MigrationCost[4].VM_1000_2000_Price }]
                        }];
                    }
                    else if (VMCount < 3000) {
                        $scope.MigrationObj = [{
                            Type: "MigrationObj",
                            subItems: [
                                { value0: response.data.d.MigrationCost[0].VM_2000_3000_Price },
                                { value1: response.data.d.MigrationCost[1].VM_2000_3000_Price },
                                { value2: response.data.d.MigrationCost[2].VM_2000_3000_Price },
                                { value3: response.data.d.MigrationCost[3].VM_2000_3000_Price },
                                { value4: response.data.d.MigrationCost[4].VM_2000_3000_Price }]
                        }];
                    }
                    else if (VMCount < 4000) {
                        $scope.MigrationObj = [{
                            Type: "MigrationObj",
                            subItems: [
                                { value0: response.data.d.MigrationCost[0].VM_3000_4000_Price },
                                { value1: response.data.d.MigrationCost[1].VM_3000_4000_Price },
                                { value2: response.data.d.MigrationCost[2].VM_3000_4000_Price },
                                { value3: response.data.d.MigrationCost[3].VM_3000_4000_Price },
                                { value4: response.data.d.MigrationCost[4].VM_3000_4000_Price }]
                        }];
                    }
                    else {
                        $scope.MigrationObj = [{
                            Type: "MigrationObj",
                            subItems: [
                                { value0: response.data.d.MigrationCost[0].VM_4000_5000_Price },
                                { value1: response.data.d.MigrationCost[1].VM_4000_5000_Price },
                                { value2: response.data.d.MigrationCost[2].VM_4000_5000_Price },
                                { value3: response.data.d.MigrationCost[3].VM_4000_5000_Price },
                                { value4: response.data.d.MigrationCost[4].VM_4000_5000_Price }]
                        }];
                    }
                    sampleService.MigrationAssumptions = $scope.MigrationObj;
                    $scope.virtualizedCost = response.data.d.CostForVirtualizedVM[0].Price; sampleService.virtualizedCost = $scope.virtualizedCost;
                    //sampleService.CostOfEndPointProtection = response.data.d.EndPointProtection;
                    sampleService.Assumptions = response.data.d;
                    $scope.BizTalkAssumption = sampleService.Assumptions.BizTalkLicenseCost; sampleService.Assumptions.BizTalkAssumption = $scope.BizTalkAssumption;
                    sampleService.BizTalkAssumption = $scope.BizTalkAssumption;
                    sampleService.DiscountStatus = netres.data.d.DiscountStatus;
                    $scope.DiscountStatus = sampleService.DiscountStatus;
                    sampleService.DBID = netres.data.d.DBID;
                    $scope.DBID = sampleService.DBID;
                    $scope.StorageCost = [
                        { Type: "Storage procurement cost/GB for local disk/SAN-HDD", Cost: response.data.d.storageCost[1].CostPerGB, Unit: "USD" },
                        { Type: "Cost per tape drive", Cost: response.data.d.storageCost[4].CostPerGB, Unit: "USD" },
                        { Type: "On-Prem DRCost", Cost: response.data.d.storageCost[5].CostPerGB, Unit: "USD" },
                        { Type: "Include Backup/DR Cost", Cost: response.data.d.storageCost[6].CostPerGB, Unit: "USD" },
                    ];
                    var checkboxcheck = response.data.d.storageCost[6].CostPerGB;
                    if (checkboxcheck == 1.00) {
                        $("#ContentPlaceHolder1_TCOAnalysisReport_Assumptions1_includeBackupDRCost").prop("checked", true);
                    }
                    else {
                        $("#ContentPlaceHolder1_TCOAnalysisReport_Assumptions1_includeBackupDRCost").prop("checked", false);
                    }
                    sampleService.StorageCost = $scope.StorageCost;
                    $scope.ItlabourCosts = {
                        TotalPhysicalServerManagedByAdmin: parseFloat(response.data.d.itlabourCost[0].ITLaborCost), TotalVmsManagedByAdmin: parseFloat(response.data.d.itlabourCost[1].ITLaborCost),
                        HourlyRate: parseFloat(response.data.d.itlabourCost[2].ITLaborCost)
                    };
                    sampleService.ItlabourCosts = $scope.ItlabourCosts;
                    $scope.PerITLaboeCost = 20; sampleService.PerITLaboeCost = $scope.PerITLaboeCost;
                    $scope.DisPer = 0; $scope.DisPerMaster = 0;
                    $scope.VirtualizationCost = {
                        TotalPhysicalServerManagedByAdmin: parseFloat(response.data.d.VirtualizationCost[0].VirtualisationCost), TotalVmsManagedByAdmin: parseFloat(response.data.d.VirtualizationCost[1].VirtualisationCost),
                        HourlyRate: parseFloat(response.data.d.VirtualizationCost[2].VirtualisationCost)
                    };
                    sampleService.VirtualizationCost = $scope.VirtualizationCost;
                    sampleService.softCostAssumption = netres.data.d.SoftwareCostAssumption;
                    sampleService.Assumptions.softCostAssumption = sampleService.softCostAssumption;
                    sampleService.Assumptions.softwareCost = response.data.d.softwareCost;
                    sampleService.isChanged1 = undefined; sampleService.isDataCenterConstructionCostChanged = undefined;
                    sampleService.IsItLabourCostChange = undefined;
                    sampleService.IsNetworkingCostChanged = undefined;
                    sampleService.SQLServerAssumptionchanged = undefined; sampleService.Tbl_StorageCostAssumptionchanged2 = undefined;
                    sampleService.isStorageCostChange = undefined;
                    sampleService.EndPointProtectionChange = undefined;
                    sampleService.isMigrationAssumptionsChanged = undefined;
                    sampleService.isBizTalkAssumptionChanged = undefined; sampleService.isvirtualizedCostChanged = undefined;
                    sampleService = ChangeToCurrency(sampleService, sampleService.CurrencyTable);
                    sampleService.Assumptions.CostForVirtualizedVM[0].Price = sampleService.virtualizedCost;

                    var data = sampleService;
                    $scope.data = sampleService.Assumptions;
                    $scope.PricePerKiloWatt = sampleService.PricePerKiloWatt;

                    sampleService.ReconLiftandShiftSqlLicenseCost = netres.data.d.ReconLiftandShiftSqlLicenseCost;
                    var AzureCostCalulation = GetAzureCostEstimation(sampleService.ReconLiftandShift_InputData, sampleService.AzureNetworkingCost, sampleService.benifit, sampleService.CurrencyTableTemp, sampleService.ReconLiftShift_MLSData, sampleService.Recon_OracleToPostgreData, sampleService.ReconLiftandShiftSqlLicenseCost, sampleService.ReconLiftandShift_BackUpStorage);
                    sampleService.AzureCostCalulation = AzureCostCalulation;

                    sampleService.HostMachineDetail = netres.data.d.HostMachineDetail;
                    angular.forEach(sampleService.HostMachineDetail, function (value, key) {
                        outputPrice = GetHostMachineData(sampleService.Assumptions.hardwareCost, value.TargetProcessor, value.NumberOfCores, value.TargetRam);

                        if (outputPrice.length > 0) {
                            TotalHardwareCost += outputPrice[0].Price;
                            outputPrice[0].TotalServer = 1;
                            HardwareConfig.push(outputPrice[0]);
                        }
                        if (outputPrice.length > 0 && value.OperatingSystem == "Windows") {
                            SoftwareConfig.push({
                                Price: 0,
                                Ram: outputPrice[0].Ram, Core: outputPrice[0].CorePerProcessor, NumberOfServer: 10, CurrentOS: value.OperatingSystem,
                                Type: "HostMachine", Processor: outputPrice[0].Processor, VMType: value.VMType, LicenseType: value.LicenseType
                            });
                        }
                        TotalSoftwareCost += 0;
                        outputPrice = GetHostMachineData(sampleService.Assumptions.electricityCost, value.TargetProcessor, value.NumberOfCores, value.TargetRam);
                        if (outputPrice.length > 0) {
                            TotalElectricityCost += ElectricityCost(outputPrice[0], $scope.NumberOfYears, sampleService.PricePerKiloWatt);
                            ElectricityConfig.push(outputPrice[0]);
                        }
                    });
                    angular.forEach(data.ServerAssumptions, function (value, key) {
                        if (value.Environment === "physicalserver") {
                            var NumberOfServer = value.isVm ? value.Vms : value.Servers;

                            //For Hardware Cost
                            outputPrice = GetHardwareCost(sampleService.Assumptions.hardwareCost, value.ProcPerServer, value.CorePerProc, value.Ram);
                            TotalHardwareCost += HardwareCost(outputPrice[0], sampleService, NumberOfServer, $scope.NumberOfYears);
                            if (outputPrice.length > 0 && value.isVm == false) {
                                outputPrice[0].TotalServer = NumberOfServer == undefined ? 1 : NumberOfServer;
                                HardwareConfig.push(outputPrice[0]);
                            }

                            //For Software Cost
                            if (outputPrice.length > 0) {
                                SoftwareConfig.push({
                                    Price: getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption),
                                    Ram: value.Ram, Core: value.CorePerProc, NumberOfServer: NumberOfServer, CurrentOS: value.OS,
                                    Type: "PhysicalMachine", Processor: value.ProcPerServer, LicenseType: value.LicenseType, VMType: value.VMType
                                });
                            }
                            TotalSoftwareCost += SoftwareCost(NumberOfServer, getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption));

                            //For Electricity Cost
                            outputPrice = GetHardwareCost(sampleService.Assumptions.electricityCost, value.ProcPerServer, value.CorePerProc, value.Ram);
                            if (outputPrice.length > 0 && value.isVm == false) {
                                TotalElectricityCost += ElectricityCost(outputPrice[0], $scope.NumberOfYears, sampleService.PricePerKiloWatt);
                                ElectricityConfig.push(outputPrice[0]);
                            }

                            //For DataCenter Cost
                            outputPrice = GetHardwareCost(sampleService.Assumptions.datacenterCost, value.ProcPerServer, value.CorePerProc, value.Ram);
                            if (outputPrice.length > 0 && value.isVm == false) {
                                requiredRacks += outputPrice[0].RackUnitsRequired * NumberOfServer;
                                outputPrice[0].TotalServer = NumberOfServer;
                                DataCenterConfig.push(outputPrice[0]);
                            }
                        }
                        else {
                            //For Software Cost
                            if (outputPrice.length > 0) {
                                SoftwareConfig.push({
                                    Price: getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption),
                                    Ram: value.Ram, Core: value.CorePerProc, NumberOfServer: NumberOfServer, CurrentOS: value.OS,
                                    Type: "VirtualMachine", Processor: value.ProcPerServer, LicenseType: value.LicenseType
                                });
                            }
                            TotalSoftwareCost += SoftwareCost(NumberOfServer, getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption));
                        }
                    });
                    TotalHardwareCost = TotalHardwareCost + ((TotalHardwareCost * 20) / 100) * $scope.NumberOfYears;

                    config.push({
                        HardwareConfig: HardwareConfig,
                        SoftwareConfig: SoftwareConfig, ElectricityConfig: ElectricityConfig, DataCenterConfig: DataCenterConfig,
                        AzureCostCalulation: AzureCostCalulation
                    });

                    $scope.$broadcast('On_premises_cost_breakdown_summaryBind', {
                        config: config
                    });
                }
                //$scope.saveAssumption("load");
            }, function (error) {
                $scope.loader = false;
                $scope.NoData = true;
                alert(error.data.Message);
            });
        });
    };

    $scope.Change = function () {
        $scope.planNewPostgre = sampleService.planNewPostgre;
        $scope.planNew = sampleService.planNew;
        $scope.plan = sampleService.plan;
        $scope.planPostgre = sampleService.planPostgre;
        $scope.loader = sampleService.loader;
        var TotalHardwareCost = 0;
        var TotalSoftwareCost = 0;
        var TotalElectricityCost = 0;
        var requiredRacks = 0;
        var data = sampleService;
        var HardwareConfig = [];
        var SoftwareConfig = [];
        var ElectricityConfig = [];
        var DataCenterConfig = [];
        var config = [];
        var outputPrice = [];
        var AzureCostCalulation = GetAzureCostEstimation(sampleService.ReconLiftandShift_InputData, sampleService.AzureNetworkingCost, sampleService.benifit, sampleService.CurrencyTableTemp, sampleService.ReconLiftShift_MLSData, sampleService.Recon_OracleToPostgreData, sampleService.ReconLiftandShiftSqlLicenseCost, sampleService.ReconLiftandShift_BackUpStorage);
        sampleService.AzureCostCalulation = AzureCostCalulation;
        angular.forEach(data.HostMachineDetail, function (value, key) {
            outputPrice = GetHostMachineData(sampleService.Assumptions.hardwareCost, value.TargetProcessor, value.NumberOfCores, value.TargetRam);

            if (outputPrice.length > 0) {
                TotalHardwareCost += outputPrice[0].Price;
                outputPrice[0].TotalServer = 1;
                HardwareConfig.push(outputPrice[0]);
            }
            if (outputPrice.length > 0 && value.OperatingSystem == "Windows") {
                SoftwareConfig.push({
                    Price: 0,
                    Ram: outputPrice[0].Ram, Core: outputPrice[0].CorePerProcessor, NumberOfServer: 10, CurrentOS: value.OperatingSystem,
                    Type: "HostMachine", Processor: outputPrice[0].Processor, VMType: value.VMType, LicenseType: value.LicenseType
                });
            }
            TotalSoftwareCost += 0;
            outputPrice = GetHostMachineData(sampleService.Assumptions.electricityCost, value.TargetProcessor, value.NumberOfCores, value.TargetRam);
            if (outputPrice.length > 0) {
                TotalElectricityCost += ElectricityCost(outputPrice[0], $scope.NumberOfYears, sampleService.PricePerKiloWatt);
                ElectricityConfig.push(outputPrice[0]);
            }
        });
        angular.forEach(data.ServerAssumptions, function (value, key) {
            if (value.Environment === "physicalserver") {
                var NumberOfServer = value.isVm ? value.Vms : value.Servers;

                //For Hardware Cost
                outputPrice = GetHardwareCost(sampleService.Assumptions.hardwareCost, value.ProcPerServer, value.CorePerProc, value.Ram);
                if (outputPrice.length > 0 && value.isVm == false) {
                    outputPrice[0].TotalServer = NumberOfServer == undefined ? 1 : NumberOfServer;
                    HardwareConfig.push(outputPrice[0]);
                }
                TotalHardwareCost += HardwareCost(outputPrice[0], sampleService, NumberOfServer, $scope.NumberOfYears);

                //For Software Cost
                if (outputPrice.length > 0) {
                    SoftwareConfig.push({
                        Price: getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption),
                        Ram: value.Ram, Core: value.CorePerProc, NumberOfServer: NumberOfServer, CurrentOS: value.OS,
                        Type: "PhysicalMachine", Processor: value.ProcPerServer, LicenseType: value.LicenseType, VMType: value.VMType
                    });
                }
                TotalSoftwareCost += SoftwareCost(NumberOfServer, getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption));

                //For Electricity Cost
                outputPrice = GetHardwareCost(sampleService.Assumptions.electricityCost, value.ProcPerServer, value.CorePerProc, value.Ram);
                if (outputPrice.length > 0 && value.isVm == false) {
                    TotalElectricityCost += ElectricityCost(outputPrice[0], $scope.NumberOfYears, sampleService.PricePerKiloWatt);
                    ElectricityConfig.push(outputPrice[0]);
                }

                //For DataCenter Cost
                outputPrice = GetHardwareCost(sampleService.Assumptions.datacenterCost, value.ProcPerServer, value.CorePerProc, value.Ram);
                if (outputPrice.length > 0 && value.isVm == false) {
                    requiredRacks += outputPrice[0].RackUnitsRequired * NumberOfServer;
                    outputPrice[0].TotalServer = NumberOfServer;
                    DataCenterConfig.push(outputPrice[0]);
                }
            }
            else {
                //For Software Cost
                if (outputPrice.length > 0) {
                    SoftwareConfig.push({
                        Price: getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption),
                        Ram: value.Ram, Core: value.CorePerProc, NumberOfServer: NumberOfServer, CurrentOS: value.OS,
                        Type: "VirtualMachine", Processor: value.ProcPerServer, LicenseType: value.LicenseType
                    });
                }
                TotalSoftwareCost += SoftwareCost(NumberOfServer, getSoftwareCostBasedOnOS(value.CurrentOS, data.softCostAssumption));
            }
        });
        TotalHardwareCost = TotalHardwareCost + ((TotalHardwareCost * 20) / 100) * $scope.NumberOfYears;

        config.push({
            HardwareConfig: HardwareConfig,
            SoftwareConfig: SoftwareConfig, ElectricityConfig: ElectricityConfig, DataCenterConfig: DataCenterConfig,
            AzureCostCalulation: AzureCostCalulation
        });

        $scope.$broadcast('On_premises_cost_breakdown_summaryBind', {
            config: config
        });
    };
    var ButtonSaved = true;

    $scope.exportData = function () {
        if (sampleService.IsFilterReset === false && sampleService.IsUserCostSavedStatus === false) {
            ButtonSaved = false;
            $scope.saveAssumption();
        }
        var tcoType = '';
        $scope.loader = true;
        $("#MyPopup").modal("hide");
        if (sampleService.sqlType === 'postgre') {
            tcoType = 'Postgre SQL';
            var planSelected = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
            var planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyear' : sampleService.planNew;
        }
        else {
            var planSelected = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
            tcoType = sampleService.sqlType;
            var planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyearhybrid' : sampleService.planNew;
        }
        $scope.MasterData =
            {
                sqlType: sampleService.sqlType,
                tcoType: tcoType,
                plan: planSelected,
                planNew: planNew,
                years: sampleService.years
            };
        sampleService.MasterData = $scope.MasterData;
        $http.post('TCOAnalysis.aspx/ExcelDownload', {
            Workload: sampleService.CoustumerInput, YearCost: sampleService.YearCostObject, StorageCost: sampleService.StorageObject,
            SoftwareCostAssumption: sampleService.softCostAssumption,
            YearCostDetail: sampleService.RentingBenifits, SQLVersionLicenseDetail: sampleService.vw_SQLVersionLicenseDetail,
            OracleVersionLicenseDetails: sampleService.vw_OracleVersionLicenseDetail, Assumptions: sampleService.Assumptions, Migration: sampleService.MigrationExcel[0],
            CashFlowExcel: sampleService.CashFlowExcel, phy: sampleService.PhySer, YearCostDetails: sampleService.DetailedYearCostObject,
            MasterData: sampleService.MasterData
        }).then(function (response) {
            location.reload();
            window.location.assign('DownloadForm.aspx', '_blank');
            $scope.loader = false;
            ButtonSaved = false;
            $('#password').val('');
        }, function (error) {
            console.log(error);
        });
    };


    $scope.saveAssumption = function () {
        $scope.loader = true;
        var planSelected = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
        var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : sampleService.tcoType === 'sql' ? 'sql' : 'postgre';
        var planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyearhybrid' : sampleService.planNew;
        var planPostgre = sampleService.planNewPostgre === undefined || sampleService.planNewPostgre === null ? 'threeyear' : sampleService.planNewPostgre;
        $scope.MasterData =
            {
                sqlType: sampleService.sqlType,
                tcoType: tcoType,
                plan: planSelected,
                planNew: planNew,
                planPostgre: planPostgre,
                years: sampleService.years
            };
        sampleService.MasterData = $scope.MasterData;
        $http.post('TCOCalculator.aspx/saveAssumption', {
            phy: sampleService.PhySer,
            Datab1: sampleService.DatabaseAssumptions,
            SQLVersionLicenseDetail1: sampleService.vw_SQLVersionLicenseDetail,
            StorageSave: sampleService.CoustumerInput,
            YearCostDetail: sampleService.RentingBenifits,
            Migration: sampleService.MigrationExcel[0],
            CashFlow: sampleService.CashFlowExcel,
            Assumptions: sampleService.Assumptions,
            SoftwareCostAssumption: sampleService.softCostAssumption,
            SaveYearCostDetails: sampleService.DetailedYearCostObject,
            MasterData: sampleService.MasterData

        }).then(function (response) {
            $scope.loader = false;
            if (ButtonSaved == true) {
                alert('Tco report Saved successfully');
                location.reload();
            }



        }, function (error) {
            console.log(error);
        });
    };
    $scope.SaveTCOCostForAIS = function () {
        // $scope.timeout(function () {
        $scope.loader = true;
        var planSelected = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
        //var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : 'sql';
        var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : tcoType === 'sql' ? 'sql' : 'postgre';
        var planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyearhybrid' : sampleService.planNew;
        $scope.MasterData =
            {
                sqlType: sampleService.sqlType,
                tcoType: tcoType,
                plan: planSelected,
                planNew: planNew,
                years: sampleService.years,
            };
        sampleService.MasterData = $scope.MasterData;
        var ad = sampleService.DetailedYearCostObject;
        $http.post('TCOCalculator.aspx/SaveTCOCostForAIS', {
            SaveYearCostDetails: sampleService.DetailedYearCostObject,
            MasterData: sampleService.MasterData
        }).then(function (response) {
        }, function (error) {
            console.log(error);
        });
        //}, 2000);
    };
    $scope.saveEditOnprmiseAssumption = function () {
        // $('#EditPopup').modal('toggle');
        $scope.loader = true;
        var planSelected = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
        var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : sampleService.tcoType === 'sql' ? 'sql' : 'postgre';
        var planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyearhybrid' : sampleService.planNew;
        var planPostgre = sampleService.planNewPostgre === undefined || sampleService.planNewPostgre === null ? 'threeyear' : sampleService.planNewPostgre;
        $scope.MasterData =
            {
                sqlType: sampleService.sqlType,
                tcoType: tcoType,
                plan: planSelected,
                planNew: planNew,
                planPostgre: planPostgre,
                years: sampleService.years
            };
        sampleService.MasterData = $scope.MasterData;
        $http.post('TCOCalculator.aspx/saveAssumption', {
            phy: sampleService.PhySer,
            Datab1: sampleService.DatabaseAssumptions,
            SQLVersionLicenseDetail1: sampleService.vw_SQLVersionLicenseDetail,
            StorageSave: sampleService.CoustumerInput,
            YearCostDetail: sampleService.RentingBenifits,
            Migration: sampleService.MigrationExcel[0],
            CashFlow: sampleService.CashFlowExcel,
            Assumptions: sampleService.Assumptions,
            SoftwareCostAssumption: sampleService.softCostAssumption,
            SaveYearCostDetails: sampleService.DetailedYearCostObject,
            MasterData: sampleService.MasterData
        }).then(function (response) {
            $('#EditPopup').modal('toggle');
            $scope.loader = true;
            EditCost = [];
            EditCost.push({ Category: "Hardware", Year1: $('#Hardware_1').val() == "" ? 0 : $('#Hardware_1').val(), Year2: $('#Hardware_2').val() == "" ? 0 : $('#Hardware_2').val(), Year3: $('#Hardware_3').val() == "" ? 0 : $('#Hardware_3').val(), Year4: $('#Hardware_4').val() == "" ? 0 : $('#Hardware_4').val(), Year5: $('#Hardware_5').val() == "" ? 0 : $('#Hardware_5').val() });
            EditCost.push({ Category: "Hardware Maintenance Cost", Year1: $("[id='Hardware Maintenance Cost_1']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_1']").val(), Year2: $("[id='Hardware Maintenance Cost_2']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_2']").val(), Year3: $("[id='Hardware Maintenance Cost_3']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_3']").val(), Year4: $("[id='Hardware Maintenance Cost_4']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_4']").val(), Year5: $("[id='Hardware Maintenance Cost_5']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_5']").val() });
            EditCost.push({ Category: "Software (Linux)", Year1: $("[id='Software (Linux)_1']").val() == "" ? 0 : $("[id='Software (Linux)_1']").val(), Year2: $("[id='Software (Linux)_2']").val() == "" ? 0 : $("[id='Software (Linux)_2']").val(), Year3: $("[id='Software (Linux)_3']").val() == "" ? 0 : $("[id='Software (Linux)_3']").val(), Year4: $("[id='Software (Linux)_4']").val() == "" ? 0 : $("[id='Software (Linux)_4']").val(), Year5: $("[id='Software (Linux)_5']").val() == "" ? 0 : $("[id='Software (Linux)_5']").val() });
            EditCost.push({ Category: "Software (Windows)", Year1: $("[id='Software (Windows)_1']").val() == "" ? 0 : $("[id='Software (Windows)_1']").val(), Year2: $("[id='Software (Windows)_2']").val() == "" ? 0 : $("[id='Software (Windows)_2']").val(), Year3: $("[id='Software (Windows)_3']").val() == "" ? 0 : $("[id='Software (Windows)_3']").val(), Year4: $("[id='Software (Windows)_4']").val() == "" ? 0 : $("[id='Software (Windows)_4']").val(), Year5: $("[id='Software (Windows)_5']").val() == "" ? 0 : $("[id='Software (Windows)_5']").val() });
            EditCost.push({ Category: "Electricity", Year1: $('#Electricity_1').val() == "" ? 0 : $('#Electricity_1').val(), Year2: $('#Electricity_2').val() == "" ? 0 : $('#Electricity_2').val(), Year3: $('#Electricity_3').val() == "" ? 0 : $('#Electricity_3').val(), Year4: $('#Electricity_4').val() == "" ? 0 : $('#Electricity_4').val(), Year5: $('#Electricity_5').val() == "" ? 0 : $('#Electricity_5').val() });
            EditCost.push({ Category: "Bandwidth", Year1: $('#Bandwidth_1').val() == "" ? 0 : $('#Bandwidth_1').val(), Year2: $('#Bandwidth_2').val() == "" ? 0 : $('#Bandwidth_2').val(), Year3: $('#Bandwidth_3').val() == "" ? 0 : $('#Bandwidth_3').val(), Year4: $('#Bandwidth_4').val() == "" ? 0 : $('#Bandwidth_4').val(), Year5: $('#Bandwidth_5').val() == "" ? 0 : $('#Bandwidth_5').val() });//Network hardware and software cost 
            EditCost.push({ Category: "Azure Advisor", Year1: $("[id='Azure Advisor_1']").val() == "" ? 0 : $("[id='Azure Advisor_1']").val(), Year2: $("[id='Azure Advisor_2']").val() == "" ? 0 : $("[id='Azure Advisor_2']").val(), Year3: $("[id='Azure Advisor_3']").val() == "" ? 0 : $("[id='Azure Advisor_3']").val(), Year4: $("[id='Azure Advisor_4']").val() == "" ? 0 : $("[id='Azure Advisor_4']").val(), Year5: $("[id='Azure Advisor_5']").val() == "" ? 0 : $("[id='Azure Advisor_5']").val() });//Network maintenance cost 
            EditCost.push({ Category: "Azure Security Center", Year1: $("[id='Azure Security Center_1']").val() == "" ? 0 : $("[id='Azure Security Center_1']").val(), Year2: $("[id='Azure Security Center_2']").val() == "" ? 0 : $("[id='Azure Security Center_2']").val(), Year3: $("[id='Azure Security Center_3']").val() == "" ? 0 : $("[id='Azure Security Center_3']").val(), Year4: $("[id='Azure Security Center_4']").val() == "" ? 0 : $("[id='Azure Security Center_4']").val(), Year5: $("[id='Azure Security Center_5']").val() == "" ? 0 : $("[id='Azure Security Center_5']").val() });//Service provider cost 
            EditCost.push({ Category: "Storage hardware cost", Year1: $("[id='Storage hardware cost_1']").val() == "" ? 0 : $("[id='Storage hardware cost_1']").val(), Year2: $("[id='Storage hardware cost_2']").val() == "" ? 0 : $("[id='Storage hardware cost_2']").val(), Year3: $("[id='Storage hardware cost_3']").val() == "" ? 0 : $("[id='Storage hardware cost_3']").val(), Year4: $("[id='Storage hardware cost_4']").val() == "" ? 0 : $("[id='Storage hardware cost_4']").val(), Year5: $("[id='Storage hardware cost_5']").val() == "" ? 0 : $("[id='Storage hardware cost_5']").val() });
            EditCost.push({ Category: "Backup and Archive cost", Year1: $("[id='Backup and Archive cost_1']").val() == "" ? 0 : $("[id='Backup and Archive cost_1']").val(), Year2: $("[id='Backup and Archive cost_2']").val() == "" ? 0 : $("[id='Backup and Archive cost_2']").val(), Year3: $("[id='Backup and Archive cost_3']").val() == "" ? 0 : $("[id='Backup and Archive cost_3']").val(), Year4: $("[id='Backup and Archive cost_4']").val() == "" ? 0 : $("[id='Backup and Archive cost_4']").val(), Year5: $("[id='Backup and Archive cost_5']").val() == "" ? 0 : $("[id='Backup and Archive cost_5']").val() });
            EditCost.push({ Category: "Storage Maintenance cost", Year1: $("[id='Storage Maintenance cost_1']").val() == "" ? 0 : $("[id='Storage Maintenance cost_1']").val(), Year2: $("[id='Storage Maintenance cost_2']").val() == "" ? 0 : $("[id='Storage Maintenance cost_2']").val(), Year3: $("[id='Storage Maintenance cost_3']").val() == "" ? 0 : $("[id='Storage Maintenance cost_3']").val(), Year4: $("[id='Storage Maintenance cost_4']").val() == "" ? 0 : $("[id='Storage Maintenance cost_4']").val(), Year5: $("[id='Storage Maintenance cost_5']").val() == "" ? 0 : $("[id='Storage Maintenance cost_5']").val() });
            EditCost.push({ Category: "IT Labor", Year1: $("[id='IT Labor_1']").val() == "" ? 0 : $("[id='IT Labor_1']").val(), Year2: $("[id='IT Labor_2']").val() == "" ? 0 : $("[id='IT Labor_2']").val(), Year3: $("[id='IT Labor_3']").val() == "" ? 0 : $("[id='IT Labor_3']").val(), Year4: $("[id='IT Labor_4']").val() == "" ? 0 : $("[id='IT Labor_4']").val(), Year5: $("[id='IT Labor_5']").val() == "" ? 0 : $("[id='IT Labor_5']").val() });
            EditCost.push({ Category: "Biztalk", Year1: $('#BizTalk_1').val() == "" ? 0 : $('#BizTalk_1').val(), Year2: $('#BizTalk_2').val() == "" ? 0 : $('#BizTalk_2').val(), Year3: $('#BizTalk_3').val() == "" ? 0 : $('#BizTalk_3').val(), Year4: $('#BizTalk_4').val() == "" ? 0 : $('#BizTalk_4').val(), Year5: $('#BizTalk_5').val() == "" ? 0 : $('#BizTalk_5').val() });
            EditCost.push({ Category: "Sql License Cost", Year1: $("[id='Sql License Cost_1']").val() == "" ? 0 : $("[id='Sql License Cost_1']").val(), Year2: $("[id='Sql License Cost_2']").val() == "" ? 0 : $("[id='Sql License Cost_2']").val(), Year3: $("[id='Sql License Cost_3']").val() == "" ? 0 : $("[id='Sql License Cost_3']").val(), Year4: $("[id='Sql License Cost_4']").val() == "" ? 0 : $("[id='Sql License Cost_4']").val(), Year5: $("[id='Sql License Cost_5']").val() == "" ? 0 : $("[id='Sql License Cost_5']").val() });
            EditCost.push({ Category: "Virtualization Cost", Year1: $("[id='Virtualization Cost_1']").val() == "" ? 0 : $("[id='Virtualization Cost_1']").val(), Year2: $("[id='Virtualization Cost_2']").val() == "" ? 0 : $("[id='Virtualization Cost_2']").val(), Year3: $("[id='Virtualization Cost_3']").val() == "" ? 0 : $("[id='Virtualization Cost_3']").val(), Year4: $("[id='Virtualization Cost_4']").val() == "" ? 0 : $("[id='Virtualization Cost_4']").val(), Year5: $("[id='Virtualization Cost_5']").val() == "" ? 0 : $("[id='Virtualization Cost_5']").val() });
            EditCost.push({ Category: "DR Cost", Year1: $("[id='DR Cost_1']").val() == "" ? 0 : $("[id='DR Cost_1']").val(), Year2: $("[id='DR Cost_2']").val() == "" ? 0 : $("[id='DR Cost_2']").val(), Year3: $("[id='DR Cost_3']").val() == "" ? 0 : $("[id='DR Cost_3']").val(), Year4: $("[id='DR Cost_4']").val() == "" ? 0 : $("[id='DR Cost_4']").val(), Year5: $("[id='DR Cost_5']").val() == "" ? 0 : $("[id='DR Cost_5']").val() });
            EditCost.push({ Category: "Data Center", Year1: $("[id='Data Center_1']").val() == "" ? 0 : $("[id='Data Center_1']").val(), Year2: $("[id='Data Center_2']").val() == "" ? 0 : $("[id='Data Center_2']").val(), Year3: $("[id='Data Center_3']").val() == "" ? 0 : $("[id='Data Center_3']").val(), Year4: $("[id='Data Center_4']").val() == "" ? 0 : $("[id='Data Center_4']").val(), Year5: $("[id='Data Center_5']").val() == "" ? 0 : $("[id='Data Center_5']").val() });
            EditCost.push({ Category: "Sa(Oracle)", Year1: $("[id='Sa(Oracle)_1']").val() == "" ? 0 : $("[id='Sa(Oracle)_1']").val(), Year2: $("[id='Sa(Oracle)_2']").val() == "" ? 0 : $("[id='Sa(Oracle)_2']").val(), Year3: $("[id='Sa(Oracle)_3']").val() == "" ? 0 : $("[id='Sa(Oracle)_3']").val(), Year4: $("[id='Sa(Oracle)_4']").val() == "" ? 0 : $("[id='Sa(Oracle)_4']").val(), Year5: $("[id='Sa(Oracle)_5']").val() == "" ? 0 : $("[id='Sa(Oracle)_5']").val() });
            EditCost.push({ Category: "Sa(SQL)", Year1: $("[id='Sa(SQL)_1']").val() == "" ? 0 : $("[id='Sa(SQL)_1']").val(), Year2: $("[id='Sa(SQL)_2']").val() == "" ? 0 : $("[id='Sa(SQL)_2']").val(), Year3: $("[id='Sa(SQL)_3']").val() == "" ? 0 : $("[id='Sa(SQL)_3']").val(), Year4: $("[id='Sa(SQL)_4']").val() == "" ? 0 : $("[id='Sa(SQL)_4']").val(), Year5: $("[id='Sa(SQL)_5']").val() == "" ? 0 : $("[id='Sa(SQL)_5']").val() });
            EditCost.push({ Category: "Sa(Windows License)", Year1: $("[id='Sa(Windows License)_1']").val() == "" ? 0 : $("[id='Sa(Windows License)_1']").val(), Year2: $("[id='Sa(Windows License)_2']").val() == "" ? 0 : $("[id='Sa(Windows License)_2']").val(), Year3: $("[id='Sa(Windows License)_3']").val() == "" ? 0 : $("[id='Sa(Windows License)_3']").val(), Year4: $("[id='Sa(Windows License)_4']").val() == "" ? 0 : $("[id='Sa(Windows License)_4']").val(), Year5: $("[id='Sa(Windows License)_5']").val() == "" ? 0 : $("[id='Sa(Windows License)_5']").val() });
            EditCost.push({ Category: "Oracle License", Year1: $("[id='Oracle License_1']").val() == "" ? 0 : $("[id='Oracle License_1']").val(), Year2: $("[id='Oracle License_2']").val() == "" ? 0 : $("[id='Oracle License_2']").val(), Year3: $("[id='Oracle License_3']").val() == "" ? 0 : $("[id='Oracle License_3']").val(), Year4: $("[id='Oracle License_4']").val() == "" ? 0 : $("[id='Oracle License_4']").val(), Year5: $("[id='Oracle License_5']").val() == "" ? 0 : $("[id='Oracle License_5']").val() });
            // EditCost.push({ Category: "Data Center", Year1: $("[id='Data Center_1']").val() == "" ? 0 : $("[id='Data Center_1']").val(), Year2: $("[id='Data Center_2']").val() == "" ? 0 : $("[id='Data Center_2']").val(), Year3: $("[id='Data Center_3']").val() == "" ? 0 : $("[id='Data Center_3']").val(), Year4: $("[id='Data Center_4']").val() == "" ? 0 : $("[id='Data Center_4']").val(), Year5: $("[id='Data Center_5']").val() == "" ? 0 : $("[id='Data Center_5']").val() });
            EditCost.push({ Category: "Sa(Linux License)", Year1: $("[id='Sa(Linux License)_1']").val() == "" ? 0 : $("[id='Sa(Linux License)_1']").val(), Year2: $("[id='Sa(Linux License)_2']").val() == "" ? 0 : $("[id='Sa(Linux License)_2']").val(), Year3: $("[id='Sa(Linux License)_3']").val() == "" ? 0 : $("[id='Sa(Linux License)_3']").val(), Year4: $("[id='Sa(Linux License)_4']").val() == "" ? 0 : $("[id='Sa(Linux License)_4']").val(), Year5: $("[id='Sa(Linux License)_5']").val() == "" ? 0 : $("[id='Sa(Linux License)_5']").val() });
            $.ajax({
                url: "TCOCalculator.aspx/SaveOnPreEditData",
                type: 'post',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify({ Editlist: EditCost }),
                dataType: 'json',
                async: false,
                success: function (data) {
                    window.location.reload(true);
                },
                error: function (request, error) {
                    console.log(arguments);
                }
            });
        }, function (error) {
            console.log(error);
        });
    };
    $scope.saveEditCustomerAssumption = function () {

        $scope.loader = true;
        // alert('hi')
        var planSelected = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
        //var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : 'sql';
        var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : sampleService.tcoType === 'sql' ? 'sql' : 'postgre';
        var planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyearhybrid' : sampleService.planNew;
        $scope.MasterData =
            {
                sqlType: sampleService.sqlType,
                tcoType: tcoType,
                plan: planSelected,
                planNew: planNew,
                years: sampleService.years
            };
        sampleService.MasterData = $scope.MasterData;

        $http.post('TCOCalculator.aspx/saveAssumption', {
            phy: sampleService.PhySer,
            Datab1: sampleService.DatabaseAssumptions,
            SQLVersionLicenseDetail1: sampleService.vw_SQLVersionLicenseDetail,
            StorageSave: sampleService.CoustumerInput,
            YearCostDetail: sampleService.RentingBenifits,
            Migration: sampleService.MigrationExcel[0],
            CashFlow: sampleService.CashFlowExcel,
            Assumptions: sampleService.Assumptions,
            SoftwareCostAssumption: sampleService.softCostAssumption,
            SaveYearCostDetails: sampleService.DetailedYearCostObject,
            MasterData: sampleService.MasterData

        }).then(function (response) {
            $('#EditPopup').modal('toggle');
            EditCost = [];
            EditCost.push({ Category: "Hardware", Year1: $('#Hardware_1').val() == "" ? 0 : $('#Hardware_1').val(), Year2: $('#Hardware_2').val() == "" ? 0 : $('#Hardware_2').val(), Year3: $('#Hardware_3').val() == "" ? 0 : $('#Hardware_3').val(), Year4: $('#Hardware_4').val() == "" ? 0 : $('#Hardware_4').val(), Year5: $('#Hardware_5').val() == "" ? 0 : $('#Hardware_5').val() });
            EditCost.push({ Category: "Hardware Maintenance Cost", Year1: $("[id='Hardware Maintenance Cost_1']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_1']").val(), Year2: $("[id='Hardware Maintenance Cost_2']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_2']").val(), Year3: $("[id='Hardware Maintenance Cost_3']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_3']").val(), Year4: $("[id='Hardware Maintenance Cost_4']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_4']").val(), Year5: $("[id='Hardware Maintenance Cost_5']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_5']").val() });
            EditCost.push({ Category: "Software (Linux)", Year1: $("[id='Software (Linux)_1']").val() == "" ? 0 : $("[id='Software (Linux)_1']").val(), Year2: $("[id='Software (Linux)_2']").val() == "" ? 0 : $("[id='Software (Linux)_2']").val(), Year3: $("[id='Software (Linux)_3']").val() == "" ? 0 : $("[id='Software (Linux)_3']").val(), Year4: $("[id='Software (Linux)_4']").val() == "" ? 0 : $("[id='Software (Linux)_4']").val(), Year5: $("[id='Software (Linux)_5']").val() == "" ? 0 : $("[id='Software (Linux)_5']").val() });
            EditCost.push({ Category: "Software (Windows)", Year1: $("[id='Software (Windows)_1']").val() == "" ? 0 : $("[id='Software (Windows)_1']").val(), Year2: $("[id='Software (Windows)_2']").val() == "" ? 0 : $("[id='Software (Windows)_2']").val(), Year3: $("[id='Software (Windows)_3']").val() == "" ? 0 : $("[id='Software (Windows)_3']").val(), Year4: $("[id='Software (Windows)_4']").val() == "" ? 0 : $("[id='Software (Windows)_4']").val(), Year5: $("[id='Software (Windows)_5']").val() == "" ? 0 : $("[id='Software (Windows)_5']").val() });
            EditCost.push({ Category: "Electricity", Year1: $('#Electricity_1').val() == "" ? 0 : $('#Electricity_1').val(), Year2: $('#Electricity_2').val() == "" ? 0 : $('#Electricity_2').val(), Year3: $('#Electricity_3').val() == "" ? 0 : $('#Electricity_3').val(), Year4: $('#Electricity_4').val() == "" ? 0 : $('#Electricity_4').val(), Year5: $('#Electricity_5').val() == "" ? 0 : $('#Electricity_5').val() });
            EditCost.push({ Category: "Bandwidth", Year1: $('#Bandwidth_1').val() == "" ? 0 : $('#Bandwidth_1').val(), Year2: $('#Bandwidth_2').val() == "" ? 0 : $('#Bandwidth_2').val(), Year3: $('#Bandwidth_3').val() == "" ? 0 : $('#Bandwidth_3').val(), Year4: $('#Bandwidth_4').val() == "" ? 0 : $('#Bandwidth_4').val(), Year5: $('#Bandwidth_5').val() == "" ? 0 : $('#Bandwidth_5').val() });//Network hardware and software cost 
            EditCost.push({ Category: "Azure Advisor", Year1: $("[id='Azure Advisor_1']").val() == "" ? 0 : $("[id='Azure Advisor_1']").val(), Year2: $("[id='Azure Advisor_2']").val() == "" ? 0 : $("[id='Azure Advisor_2']").val(), Year3: $("[id='Azure Advisor_3']").val() == "" ? 0 : $("[id='Azure Advisor_3']").val(), Year4: $("[id='Azure Advisor_4']").val() == "" ? 0 : $("[id='Azure Advisor_4']").val(), Year5: $("[id='Azure Advisor_5']").val() == "" ? 0 : $("[id='Azure Advisor_5']").val() });//Network maintenance cost 
            EditCost.push({ Category: "Azure Security Center", Year1: $("[id='Azure Security Center_1']").val() == "" ? 0 : $("[id='Azure Security Center_1']").val(), Year2: $("[id='Azure Security Center_2']").val() == "" ? 0 : $("[id='Azure Security Center_2']").val(), Year3: $("[id='Azure Security Center_3']").val() == "" ? 0 : $("[id='Azure Security Center_3']").val(), Year4: $("[id='Azure Security Center_4']").val() == "" ? 0 : $("[id='Azure Security Center_4']").val(), Year5: $("[id='Azure Security Center_5']").val() == "" ? 0 : $("[id='Azure Security Center_5']").val() });//Service provider cost 
            EditCost.push({ Category: "Storage hardware cost", Year1: $("[id='Storage hardware cost_1']").val() == "" ? 0 : $("[id='Storage hardware cost_1']").val(), Year2: $("[id='Storage hardware cost_2']").val() == "" ? 0 : $("[id='Storage hardware cost_2']").val(), Year3: $("[id='Storage hardware cost_3']").val() == "" ? 0 : $("[id='Storage hardware cost_3']").val(), Year4: $("[id='Storage hardware cost_4']").val() == "" ? 0 : $("[id='Storage hardware cost_4']").val(), Year5: $("[id='Storage hardware cost_5']").val() == "" ? 0 : $("[id='Storage hardware cost_5']").val() });
            EditCost.push({ Category: "Backup and Archive cost", Year1: $("[id='Backup and Archive cost_1']").val() == "" ? 0 : $("[id='Backup and Archive cost_1']").val(), Year2: $("[id='Backup and Archive cost_2']").val() == "" ? 0 : $("[id='Backup and Archive cost_2']").val(), Year3: $("[id='Backup and Archive cost_3']").val() == "" ? 0 : $("[id='Backup and Archive cost_3']").val(), Year4: $("[id='Backup and Archive cost_4']").val() == "" ? 0 : $("[id='Backup and Archive cost_4']").val(), Year5: $("[id='Backup and Archive cost_5']").val() == "" ? 0 : $("[id='Backup and Archive cost_5']").val() });
            EditCost.push({ Category: "Storage Maintenance cost", Year1: $("[id='Storage Maintenance cost_1']").val() == "" ? 0 : $("[id='Storage Maintenance cost_1']").val(), Year2: $("[id='Storage Maintenance cost_2']").val() == "" ? 0 : $("[id='Storage Maintenance cost_2']").val(), Year3: $("[id='Storage Maintenance cost_3']").val() == "" ? 0 : $("[id='Storage Maintenance cost_3']").val(), Year4: $("[id='Storage Maintenance cost_4']").val() == "" ? 0 : $("[id='Storage Maintenance cost_4']").val(), Year5: $("[id='Storage Maintenance cost_5']").val() == "" ? 0 : $("[id='Storage Maintenance cost_5']").val() });
            EditCost.push({ Category: "IT Labor", Year1: $("[id='IT Labor_1']").val() == "" ? 0 : $("[id='IT Labor_1']").val(), Year2: $("[id='IT Labor_2']").val() == "" ? 0 : $("[id='IT Labor_2']").val(), Year3: $("[id='IT Labor_3']").val() == "" ? 0 : $("[id='IT Labor_3']").val(), Year4: $("[id='IT Labor_4']").val() == "" ? 0 : $("[id='IT Labor_4']").val(), Year5: $("[id='IT Labor_5']").val() == "" ? 0 : $("[id='IT Labor_5']").val() });
            EditCost.push({ Category: "Biztalk", Year1: $('#BizTalk_1').val() == "" ? 0 : $('#BizTalk_1').val(), Year2: $('#BizTalk_2').val() == "" ? 0 : $('#BizTalk_2').val(), Year3: $('#BizTalk_3').val() == "" ? 0 : $('#BizTalk_3').val(), Year4: $('#BizTalk_4').val() == "" ? 0 : $('#BizTalk_4').val(), Year5: $('#BizTalk_5').val() == "" ? 0 : $('#BizTalk_5').val() });
            EditCost.push({ Category: "Sql License Cost", Year1: $("[id='Sql License Cost_1']").val() == "" ? 0 : $("[id='Sql License Cost_1']").val(), Year2: $("[id='Sql License Cost_2']").val() == "" ? 0 : $("[id='Sql License Cost_2']").val(), Year3: $("[id='Sql License Cost_3']").val() == "" ? 0 : $("[id='Sql License Cost_3']").val(), Year4: $("[id='Sql License Cost_4']").val() == "" ? 0 : $("[id='Sql License Cost_4']").val(), Year5: $("[id='Sql License Cost_5']").val() == "" ? 0 : $("[id='Sql License Cost_5']").val() });
            EditCost.push({ Category: "Virtualization Cost", Year1: $("[id='Virtualization Cost_1']").val() == "" ? 0 : $("[id='Virtualization Cost_1']").val(), Year2: $("[id='Virtualization Cost_2']").val() == "" ? 0 : $("[id='Virtualization Cost_2']").val(), Year3: $("[id='Virtualization Cost_3']").val() == "" ? 0 : $("[id='Virtualization Cost_3']").val(), Year4: $("[id='Virtualization Cost_4']").val() == "" ? 0 : $("[id='Virtualization Cost_4']").val(), Year5: $("[id='Virtualization Cost_5']").val() == "" ? 0 : $("[id='Virtualization Cost_5']").val() });
            EditCost.push({ Category: "DR Cost", Year1: $("[id='DR Cost_1']").val() == "" ? 0 : $("[id='DR Cost_1']").val(), Year2: $("[id='DR Cost_2']").val() == "" ? 0 : $("[id='DR Cost_2']").val(), Year3: $("[id='DR Cost_3']").val() == "" ? 0 : $("[id='DR Cost_3']").val(), Year4: $("[id='DR Cost_4']").val() == "" ? 0 : $("[id='DR Cost_4']").val(), Year5: $("[id='DR Cost_5']").val() == "" ? 0 : $("[id='DR Cost_5']").val() });
            EditCost.push({ Category: "Data Center", Year1: $("[id='Data Center_1']").val() == "" ? 0 : $("[id='Data Center_1']").val(), Year2: $("[id='Data Center_2']").val() == "" ? 0 : $("[id='Data Center_2']").val(), Year3: $("[id='Data Center_3']").val() == "" ? 0 : $("[id='Data Center_3']").val(), Year4: $("[id='Data Center_4']").val() == "" ? 0 : $("[id='Data Center_4']").val(), Year5: $("[id='Data Center_5']").val() == "" ? 0 : $("[id='Data Center_5']").val() });
            EditCost.push({ Category: "Sa(Oracle)", Year1: $("[id='Sa(Oracle)_1']").val() == "" ? 0 : $("[id='Sa(Oracle)_1']").val(), Year2: $("[id='Sa(Oracle)_2']").val() == "" ? 0 : $("[id='Sa(Oracle)_2']").val(), Year3: $("[id='Sa(Oracle)_3']").val() == "" ? 0 : $("[id='Sa(Oracle)_3']").val(), Year4: $("[id='Sa(Oracle)_4']").val() == "" ? 0 : $("[id='Sa(Oracle)_4']").val(), Year5: $("[id='Sa(Oracle)_5']").val() == "" ? 0 : $("[id='Sa(Oracle)_5']").val() });
            EditCost.push({ Category: "Sa(SQL)", Year1: $("[id='Sa(SQL)_1']").val() == "" ? 0 : $("[id='Sa(SQL)_1']").val(), Year2: $("[id='Sa(SQL)_2']").val() == "" ? 0 : $("[id='Sa(SQL)_2']").val(), Year3: $("[id='Sa(SQL)_3']").val() == "" ? 0 : $("[id='Sa(SQL)_3']").val(), Year4: $("[id='Sa(SQL)_4']").val() == "" ? 0 : $("[id='Sa(SQL)_4']").val(), Year5: $("[id='Sa(SQL)_5']").val() == "" ? 0 : $("[id='Sa(SQL)_5']").val() });
            EditCost.push({ Category: "Sa(Windows License)", Year1: $("[id='Sa(Windows License)_1']").val() == "" ? 0 : $("[id='Sa(Windows License)_1']").val(), Year2: $("[id='Sa(Windows License)_2']").val() == "" ? 0 : $("[id='Sa(Windows License)_2']").val(), Year3: $("[id='Sa(Windows License)_3']").val() == "" ? 0 : $("[id='Sa(Windows License)_3']").val(), Year4: $("[id='Sa(Windows License)_4']").val() == "" ? 0 : $("[id='Sa(Windows License)_4']").val(), Year5: $("[id='Sa(Windows License)_5']").val() == "" ? 0 : $("[id='Sa(Windows License)_5']").val() });
            EditCost.push({ Category: "Oracle License", Year1: $("[id='Oracle License_1']").val() == "" ? 0 : $("[id='Oracle License_1']").val(), Year2: $("[id='Oracle License_2']").val() == "" ? 0 : $("[id='Oracle License_2']").val(), Year3: $("[id='Oracle License_3']").val() == "" ? 0 : $("[id='Oracle License_3']").val(), Year4: $("[id='Oracle License_4']").val() == "" ? 0 : $("[id='Oracle License_4']").val(), Year5: $("[id='Oracle License_5']").val() == "" ? 0 : $("[id='Oracle License_5']").val() });
            // EditCost.push({ Category: "Data Center", Year1: $("[id='Data Center_1']").val() == "" ? 0 : $("[id='Data Center_1']").val(), Year2: $("[id='Data Center_2']").val() == "" ? 0 : $("[id='Data Center_2']").val(), Year3: $("[id='Data Center_3']").val() == "" ? 0 : $("[id='Data Center_3']").val(), Year4: $("[id='Data Center_4']").val() == "" ? 0 : $("[id='Data Center_4']").val(), Year5: $("[id='Data Center_5']").val() == "" ? 0 : $("[id='Data Center_5']").val() });
            EditCost.push({ Category: "Sa(Linux License)", Year1: $("[id='Sa(Linux License)_1']").val() == "" ? 0 : $("[id='Sa(Linux License)_1']").val(), Year2: $("[id='Sa(Linux License)_2']").val() == "" ? 0 : $("[id='Sa(Linux License)_2']").val(), Year3: $("[id='Sa(Linux License)_3']").val() == "" ? 0 : $("[id='Sa(Linux License)_3']").val(), Year4: $("[id='Sa(Linux License)_4']").val() == "" ? 0 : $("[id='Sa(Linux License)_4']").val(), Year5: $("[id='Sa(Linux License)_5']").val() == "" ? 0 : $("[id='Sa(Linux License)_5']").val() });

            $.ajax({
                url: "TCOCalculator.aspx/SaveOnPreEditData",
                type: 'post',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify({ Editlist: EditCost }),
                dataType: 'json',
                async: false,
                success: function (data) {
                    window.location.reload(true);
                },
                error: function (request, error) {
                    console.log(arguments);
                }
            });
        }, function (error) {
            console.log(error);
        });

    };
    $scope.saveEditAzureAssumption = function () {
        $scope.loader = true;
        var planSelected = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
        // var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : 'sql';
        var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : sampleService.tcoType === 'sql' ? 'sql' : 'postgre';
        var planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyearhybrid' : sampleService.planNew;
        $scope.MasterData =
            {
                sqlType: sampleService.sqlType,
                tcoType: tcoType,
                plan: planSelected,
                planNew: planNew,
                years: sampleService.years
            };
        sampleService.MasterData = $scope.MasterData;

        $http.post('TCOCalculator.aspx/saveAssumption', {
            phy: sampleService.PhySer,
            Datab1: sampleService.DatabaseAssumptions,
            SQLVersionLicenseDetail1: sampleService.vw_SQLVersionLicenseDetail,
            StorageSave: sampleService.CoustumerInput,
            YearCostDetail: sampleService.RentingBenifits,
            Migration: sampleService.MigrationExcel[0],
            CashFlow: sampleService.CashFlowExcel,
            Assumptions: sampleService.Assumptions,
            SoftwareCostAssumption: sampleService.softCostAssumption,
            SaveYearCostDetails: sampleService.DetailedYearCostObject,
            MasterData: sampleService.MasterData

        }).then(function (response) {
            EditCost = [];
            EditCost.push({ Category: "Hardware", Year1: $("[id='Hardware_azure1']").val() == "" ? 0 : $("[id='Hardware_azure1']").val(), Year2: $("[id='Hardware_azure2']").val() == "" ? 0 : $("[id='Hardware_azure2").val(), Year3: $("[id='Hardware_azure3']").val() == "" ? 0 : $("[id='Hardware_azure3']").val(), Year4: $("[id='Hardware_azure4']").val() == "" ? 0 : $("[id='Hardware_azure4']").val(), Year5: $("[id='Hardware_azure5']").val() == "" ? 0 : $("[id='Hardware_azure5']").val() });
            EditCost.push({ Category: "Hardware Maintenance Cost", Year1: $("[id='Hardware Maintenance Cost_azure1']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure1']").val(), Year2: $("[id='Hardware Maintenance Cost_azure2']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure2").val(), Year3: $("[id='Hardware Maintenance Cost_azure3']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure3']").val(), Year4: $("[id='Hardware Maintenance Cost_azure4']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure4']").val(), Year5: $("[id='Hardware Maintenance Cost_azure5']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure5']").val() });
            EditCost.push({ Category: "Software (Linux)", Year1: $("[id='Software (Linux)_azure1']").val() == "" ? 0 : $("[id='Software (Linux)_azure1']").val(), Year2: $("[id='Software (Linux)_azure2']").val() == "" ? 0 : $("[id='Software (Linux)_azure2").val(), Year3: $("[id='Software (Linux)_azure3']").val() == "" ? 0 : $("[id='Software (Linux)_azure3']").val(), Year4: $("[id='Software (Linux)_azure4']").val() == "" ? 0 : $("[id='Software (Linux)_azure4']").val(), Year5: $("[id='Software (Linux)_azure5']").val() == "" ? 0 : $("[id='Software (Linux)_azure5']").val() });
            EditCost.push({ Category: "BizTalk", Year1: $("[id='BizTalk_azure1']").val() == "" ? 0 : $("[id='BizTalk_azure1']").val(), Year2: $("[id='BizTalk_azure2']").val() == "" ? 0 : $("[id='BizTalk_azure2").val(), Year3: $("[id='BizTalk_azure3']").val() == "" ? 0 : $("[id='BizTalk_azure3']").val(), Year4: $("[id='BizTalk_azure4']").val() == "" ? 0 : $("[id='BizTalk_azure4']").val(), Year5: $("[id='BizTalk_azure5']").val() == "" ? 0 : $("[id='BizTalk_azure5']").val() });
            EditCost.push({ Category: "Sql License Cost", Year1: $("[id='Sql License Cost_azure1']").val() == "" ? 0 : $("[id='Sql License Cost_azure1']").val(), Year2: $("[id='Sql License Cost_azure2']").val() == "" ? 0 : $("[id='Sql License Cost_azure2").val(), Year3: $("[id='Sql License Cost_azure3']").val() == "" ? 0 : $("[id='Sql License Cost_azure3']").val(), Year4: $("[id='Sql License Cost_azure4']").val() == "" ? 0 : $("[id='Sql License Cost_azure4']").val(), Year5: $("[id='Sql License Cost_azure5']").val() == "" ? 0 : $("[id='Sql License Cost_azure5']").val() });
            EditCost.push({ Category: "Oracle License", Year1: $("[id='Oracle License_azure1']").val() == "" ? 0 : $("[id='Oracle License_azure1']").val(), Year2: $("[id='Oracle License_azure2']").val() == "" ? 0 : $("[id='Oracle License_azure2").val(), Year3: $("[id='Oracle License_azure3']").val() == "" ? 0 : $("[id='Oracle License_azure3']").val(), Year4: $("[id='Oracle License_azure4']").val() == "" ? 0 : $("[id='Oracle License_azure4']").val(), Year5: $("[id='Oracle License_azure5']").val() == "" ? 0 : $("[id='Oracle License_azure5']").val() });
            EditCost.push({ Category: "Sa(Oracle)", Year1: $("[id='Sa(Oracle)_azure1']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure1']").val(), Year2: $("[id='Sa(Oracle)_azure2']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure2").val(), Year3: $("[id='Sa(Oracle)_azure3']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure3']").val(), Year4: $("[id='Sa(Oracle)_azure4']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure4']").val(), Year5: $("[id='Sa(Oracle)_azure5']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure5']").val() });
            EditCost.push({ Category: "DR Cost", Year1: $("[id='DR Cost_azure1']").val() == "" ? 0 : $("[id='DR Cost_azure1']").val(), Year2: $("[id='DR Cost_azure2']").val() == "" ? 0 : $("[id='DR Cost_azure2").val(), Year3: $("[id='DR Cost_azure3']").val() == "" ? 0 : $("[id='DR Cost_azure3']").val(), Year4: $("[id='DR Cost_azure4']").val() == "" ? 0 : $("[id='DR Cost_azure4']").val(), Year5: $("[id='DR Cost_azure5']").val() == "" ? 0 : $("[id='DR Cost_azure5']").val() });
            EditCost.push({ Category: "Data Center", Year1: $("[id='Data Center_azure1']").val() == "" ? 0 : $("[id='Data Center_azure1']").val(), Year2: $("[id='Data Center_azure2']").val() == "" ? 0 : $("[id='Data Center_azure2").val(), Year3: $("[id='Data Center_azure3']").val() == "" ? 0 : $("[id='Data Center_azure3']").val(), Year4: $("[id='Data Center_azure4']").val() == "" ? 0 : $("[id='Data Center_azure4']").val(), Year5: $("[id='Data Center_azure5']").val() == "" ? 0 : $("[id='Data Center_azure5']").val() });
            EditCost.push({ Category: "Bandwidth", Year1: $("[id='Bandwidth_azure1']").val() == "" ? 0 : $("[id='Bandwidth_azure1']").val(), Year2: $("[id='Bandwidth_azure2']").val() == "" ? 0 : $("[id='Bandwidth_azure2").val(), Year3: $("[id='Bandwidth_azure3']").val() == "" ? 0 : $("[id='Bandwidth_azure3']").val(), Year4: $("[id='Bandwidth_azure4']").val() == "" ? 0 : $("[id='Bandwidth_azure4']").val(), Year5: $("[id='Bandwidth_azure5']").val() == "" ? 0 : $("[id='Bandwidth_azure5']").val() });
            EditCost.push({ Category: "Azure Advisor", Year1: $("[id='Azure Advisor_azure1']").val() == "" ? 0 : $("[id='Azure Advisor_azure1']").val(), Year2: $("[id='Azure Advisor_azure2']").val() == "" ? 0 : $("[id='Azure Advisor_azure2").val(), Year3: $("[id='Azure Advisor_azure3']").val() == "" ? 0 : $("[id='Azure Advisor_azure3']").val(), Year4: $("[id='Azure Advisor_azure4']").val() == "" ? 0 : $("[id='Azure Advisor_azure4']").val(), Year5: $("[id='Azure Advisor_azure5']").val() == "" ? 0 : $("[id='Azure Advisor_azure5']").val() });
            //EditCost.push({ Category: "Azure Security Center", Year1: $("[id='Azure Security Center_azure1']").val() == "" ? 0 : $("[id='Azure Security Center_azure1']").val(), Year2: $("[id='Azure Security Center_azure2']").val() == "" ? 0 : $("[id='Azure Security Center_azure2").val(), Year3: $("[id='Azure Security Center_azure3']").val() == "" ? 0 : $("[id='Azure Security Center_azure3']").val(), Year4: $("[id='Azure Security Center_azure4']").val() == "" ? 0 : $("[id='Azure Security Center_azure4']").val(), Year5: $("[id='Azure Security Center_azure5']").val() == "" ? 0 : $("[id='Azure Security Center_azure5']").val() });
            EditCost.push({ Category: "Azure Active Directory", Year1: $("[id='Azure Active Directory_azure1']").val() == "" ? 0 : $("[id='Azure Active Directory_azure1']").val(), Year2: $("[id='Azure Active Directory_azure2']").val() == "" ? 0 : $("[id='Azure Active Directory_azure2").val(), Year3: $("[id='Azure Active Directory_azure3']").val() == "" ? 0 : $("[id='Azure Active Directory_azure3']").val(), Year4: $("[id='Azure Active Directory_azure4']").val() == "" ? 0 : $("[id='Azure Active Directory_azure4']").val(), Year5: $("[id='Azure Active Directory_azure5']").val() == "" ? 0 : $("[id='Azure Active Directory_azure5']").val() });
            EditCost.push({ Category: "Application Gateway", Year1: $("[id='Application Gateway_azure1']").val() == "" ? 0 : $("[id='Application Gateway_azure1']").val(), Year2: $("[id='Application Gateway_azure2']").val() == "" ? 0 : $("[id='Application Gateway_azure2").val(), Year3: $("[id='Application Gateway_azure3']").val() == "" ? 0 : $("[id='Application Gateway_azure3']").val(), Year4: $("[id='Application Gateway_azure4']").val() == "" ? 0 : $("[id='Application Gateway_azure4']").val(), Year5: $("[id='Application Gateway_azure5']").val() == "" ? 0 : $("[id='Application Gateway_azure5']").val() });
            //EditCost.push({ Category: "Backup", Year1: $("[id='Backup_azure1']").val() == "" ? 0 : $("[id='Backup_azure1']").val(), Year2: $("[id='Backup_azure2']").val() == "" ? 0 : $("[id='Backup_azure2").val(), Year3: $("[id='Backup_azure3']").val() == "" ? 0 : $("[id='Backup_azure3']").val(), Year4: $("[id='Backup_azure4']").val() == "" ? 0 : $("[id='Backup_azure4']").val(), Year5: $("[id='Backup_azure5']").val() == "" ? 0 : $("[id='Backup_azure5']").val() });
            EditCost.push({ Category: "Traffic Manager", Year1: $("[id='Traffic Manager_azure1']").val() == "" ? 0 : $("[id='Traffic Manager_azure1']").val(), Year2: $("[id='Traffic Manager_azure2']").val() == "" ? 0 : $("[id='Traffic Manager_azure2").val(), Year3: $("[id='Traffic Manager_azure3']").val() == "" ? 0 : $("[id='Traffic Manager_azure3']").val(), Year4: $("[id='Traffic Manager_azure4']").val() == "" ? 0 : $("[id='Traffic Manager_azure4']").val(), Year5: $("[id='Traffic Manager_azure5']").val() == "" ? 0 : $("[id='Traffic Manager_azure5']").val() });
            EditCost.push({ Category: "Network Watcher", Year1: $("[id='Network Watcher_azure1']").val() == "" ? 0 : $("[id='Network Watcher_azure1']").val(), Year2: $("[id='Network Watcher_azure2']").val() == "" ? 0 : $("[id='Network Watcher_azure2").val(), Year3: $("[id='Network Watcher_azure3']").val() == "" ? 0 : $("[id='Network Watcher_azure3']").val(), Year4: $("[id='Network Watcher_azure4']").val() == "" ? 0 : $("[id='Network Watcher_azure4']").val(), Year5: $("[id='Network Watcher_azure5']").val() == "" ? 0 : $("[id='Network Watcher_azure5']").val() });
            EditCost.push({ Category: "Loadbalancer", Year1: $("[id='Loadbalancer_azure1']").val() == "" ? 0 : $("[id='Loadbalancer_azure1']").val(), Year2: $("[id='Loadbalancer_azure2']").val() == "" ? 0 : $("[id='Loadbalancer_azure2").val(), Year3: $("[id='Loadbalancer_azure3']").val() == "" ? 0 : $("[id='Loadbalancer_azure3']").val(), Year4: $("[id='Loadbalancer_azure4']").val() == "" ? 0 : $("[id='Loadbalancer_azure4']").val(), Year5: $("[id='Loadbalancer_azure5']").val() == "" ? 0 : $("[id='Loadbalancer_azure5']").val() });
            EditCost.push({ Category: "Express Route", Year1: $("[id='Express Route_azure1']").val() == "" ? 0 : $("[id='Express Route_azure1']").val(), Year2: $("[id='Express Route_azure2']").val() == "" ? 0 : $("[id='Express Route_azure2").val(), Year3: $("[id='Express Route_azure3']").val() == "" ? 0 : $("[id='Express Route_azure3']").val(), Year4: $("[id='Express Route_azure4']").val() == "" ? 0 : $("[id='Express Route_azure4']").val(), Year5: $("[id='Express Route_azure5']").val() == "" ? 0 : $("[id='Express Route_azure5']").val() });
            EditCost.push({ Category: "Virtual Network", Year1: $("[id='Virtual Network_azure1']").val() == "" ? 0 : $("[id='Virtual Network_azure1']").val(), Year2: $("[id='Virtual Network_azure2']").val() == "" ? 0 : $("[id='Virtual Network_azure2").val(), Year3: $("[id='Virtual Network_azure3']").val() == "" ? 0 : $("[id='Virtual Network_azure3']").val(), Year4: $("[id='Virtual Network_azure4']").val() == "" ? 0 : $("[id='Virtual Network_azure4']").val(), Year5: $("[id='Virtual Network_azure5']").val() == "" ? 0 : $("[id='Virtual Network_azure5']").val() });
            EditCost.push({ Category: "IP Addresses", Year1: $("[id='IP Addresses_azure1']").val() == "" ? 0 : $("[id='IP Addresses_azure1']").val(), Year2: $("[id='IP Addresses_azure2']").val() == "" ? 0 : $("[id='IP Addresses_azure2").val(), Year3: $("[id='IP Addresses_azure3']").val() == "" ? 0 : $("[id='IP Addresses_azure3']").val(), Year4: $("[id='IP Addresses_azure4']").val() == "" ? 0 : $("[id='IP Addresses_azure4']").val(), Year5: $("[id='IP Addresses_azure5']").val() == "" ? 0 : $("[id='IP Addresses_azure5']").val() });
            //EditCost.push({ Category: "VPN Gateway", Year1: $("[id='VPN Gateway_azure1']").val() == "" ? 0 : $("[id='VPN Gateway_azure1']").val(), Year2: $("[id='VPN Gateway_azure2']").val() == "" ? 0 : $("[id='VPN Gateway_azure2").val(), Year3: $("[id='VPN Gateway_azure3']").val() == "" ? 0 : $("[id='VPN Gateway_azure3']").val(), Year4: $("[id='VPN Gateway_azure4']").val() == "" ? 0 : $("[id='VPN Gateway_azure4']").val(), Year5: $("[id='VPN Gateway_azure5']").val() == "" ? 0 : $("[id='VPN Gateway_azure5']").val() });
            EditCost.push({ Category: "Log Analytics", Year1: $("[id='Log Analytics_azure1']").val() == "" ? 0 : $("[id='Log Analytics_azure1']").val(), Year2: $("[id='Log Analytics_azure2']").val() == "" ? 0 : $("[id='Log Analytics_azure2").val(), Year3: $("[id='Log Analytics_azure3']").val() == "" ? 0 : $("[id='Log Analytics_azure3']").val(), Year4: $("[id='Log Analytics_azure4']").val() == "" ? 0 : $("[id='Log Analytics_azure4']").val(), Year5: $("[id='Log Analytics_azure5']").val() == "" ? 0 : $("[id='Log Analytics_azure5']").val() });
            EditCost.push({ Category: "Key Vault", Year1: $("[id='Key Vault_azure1']").val() == "" ? 0 : $("[id='Key Vault_azure1']").val(), Year2: $("[id='Key Vault_azure2']").val() == "" ? 0 : $("[id='Key Vault_azure2").val(), Year3: $("[id='Key Vault_azure3']").val() == "" ? 0 : $("[id='Key Vault_azure3']").val(), Year4: $("[id='Key Vault_azure4']").val() == "" ? 0 : $("[id='Key Vault_azure4']").val(), Year5: $("[id='Key Vault_azure5']").val() == "" ? 0 : $("[id='Key Vault_azure5']").val() });
            EditCost.push({ Category: "Storage hardware cost", Year1: $("[id='Storage hardware cost_azure1']").val() == "" ? 0 : $("[id='Storage hardware cost_azure1']").val(), Year2: $("[id='Storage hardware cost_azure2']").val() == "" ? 0 : $("[id='Storage hardware cost_azure2").val(), Year3: $("[id='Storage hardware cost_azure3']").val() == "" ? 0 : $("[id='Storage hardware cost_azure3']").val(), Year4: $("[id='Storage hardware cost_azure4']").val() == "" ? 0 : $("[id='Storage hardware cost_azure4']").val(), Year5: $("[id='Storage hardware cost_azure5']").val() == "" ? 0 : $("[id='Storage hardware cost_azure5']").val() });
            EditCost.push({ Category: "Backup and Archive cost", Year1: $("[id='Backup and Archive cost_azure1']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure1']").val(), Year2: $("[id='Backup and Archive cost_azure2']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure2").val(), Year3: $("[id='Backup and Archive cost_azure3']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure3']").val(), Year4: $("[id='Backup and Archive cost_azure4']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure4']").val(), Year5: $("[id='Backup and Archive cost_azure5']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure5']").val() });
            EditCost.push({ Category: "IT Labor", Year1: $("[id='IT Labor_azure1']").val() == "" ? 0 : $("[id='IT Labor_azure1']").val(), Year2: $("[id='IT Labor_azure2']").val() == "" ? 0 : $("[id='IT Labor_azure2").val(), Year3: $("[id='IT Labor_azure3']").val() == "" ? 0 : $("[id='IT Labor_azure3']").val(), Year4: $("[id='IT Labor_azure4']").val() == "" ? 0 : $("[id='IT Labor_azure4']").val(), Year5: $("[id='IT Labor_azure5']").val() == "" ? 0 : $("[id='IT Labor_azure5']").val() });

            $.ajax({
                url: "TCOCalculator.aspx/SaveAzureEditData",
                type: 'post',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify({ Editlist: EditCost }),
                dataType: 'json',
                async: false,
                success: function (data) {
                    window.location.reload(true);
                },
                error: function (request, error) {
                    console.log(arguments);
                }
            });
        }, function (error) {
            console.log(error);
        });

    };
    $scope.UpdateAssumption = function () {
        //  $('#EditPopup').modal('toggle');
        var AD = sampleService.UserCostSavedInDb;
        if (AD === undefined || AD.length > 0) {
            $scope.saveEditOnprmiseAssumption();
        }
    };
    $scope.UpdateAzureAssumption = function () {
        $('#EditAzurePopup').modal('toggle');

        var AD = sampleService.UserCostSavedInDb;
        if (AD === undefined || AD.length > 0) {
            $scope.saveEditAzureAssumption();

        }
        else {
            EditCost = [];
            EditCost.push({ Category: "Hardware", Year1: $("[id='Hardware_azure1']").val() == "" ? 0 : $("[id='Hardware_azure1']").val(), Year2: $("[id='Hardware_azure2']").val() == "" ? 0 : $("[id='Hardware_azure2").val(), Year3: $("[id='Hardware_azure3']").val() == "" ? 0 : $("[id='Hardware_azure3']").val(), Year4: $("[id='Hardware_azure4']").val() == "" ? 0 : $("[id='Hardware_azure4']").val(), Year5: $("[id='Hardware_azure5']").val() == "" ? 0 : $("[id='Hardware_azure5']").val() });
            EditCost.push({ Category: "Hardware Maintenance Cost", Year1: $("[id='Hardware Maintenance Cost_azure1']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure1']").val(), Year2: $("[id='Hardware Maintenance Cost_azure2']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure2").val(), Year3: $("[id='Hardware Maintenance Cost_azure3']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure3']").val(), Year4: $("[id='Hardware Maintenance Cost_azure4']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure4']").val(), Year5: $("[id='Hardware Maintenance Cost_azure5']").val() == "" ? 0 : $("[id='Hardware Maintenance Cost_azure5']").val() });
            EditCost.push({ Category: "Software (Linux)", Year1: $("[id='Software (Linux)_azure1']").val() == "" ? 0 : $("[id='Software (Linux)_azure1']").val(), Year2: $("[id='Software (Linux)_azure2']").val() == "" ? 0 : $("[id='Software (Linux)_azure2").val(), Year3: $("[id='Software (Linux)_azure3']").val() == "" ? 0 : $("[id='Software (Linux)_azure3']").val(), Year4: $("[id='Software (Linux)_azure4']").val() == "" ? 0 : $("[id='Software (Linux)_azure4']").val(), Year5: $("[id='Software (Linux)_azure5']").val() == "" ? 0 : $("[id='Software (Linux)_azure5']").val() });
            EditCost.push({ Category: "BizTalk", Year1: $("[id='BizTalk_azure1']").val() == "" ? 0 : $("[id='BizTalk_azure1']").val(), Year2: $("[id='BizTalk_azure2']").val() == "" ? 0 : $("[id='BizTalk_azure2").val(), Year3: $("[id='BizTalk_azure3']").val() == "" ? 0 : $("[id='BizTalk_azure3']").val(), Year4: $("[id='BizTalk_azure4']").val() == "" ? 0 : $("[id='BizTalk_azure4']").val(), Year5: $("[id='BizTalk_azure5']").val() == "" ? 0 : $("[id='BizTalk_azure5']").val() });
            EditCost.push({ Category: "Sql License Cost", Year1: $("[id='Sql License Cost_azure1']").val() == "" ? 0 : $("[id='Sql License Cost_azure1']").val(), Year2: $("[id='Sql License Cost_azure2']").val() == "" ? 0 : $("[id='Sql License Cost_azure2").val(), Year3: $("[id='Sql License Cost_azure3']").val() == "" ? 0 : $("[id='Sql License Cost_azure3']").val(), Year4: $("[id='Sql License Cost_azure4']").val() == "" ? 0 : $("[id='Sql License Cost_azure4']").val(), Year5: $("[id='Sql License Cost_azure5']").val() == "" ? 0 : $("[id='Sql License Cost_azure5']").val() });
            EditCost.push({ Category: "Oracle License", Year1: $("[id='Oracle License_azure1']").val() == "" ? 0 : $("[id='Oracle License_azure1']").val(), Year2: $("[id='Oracle License_azure2']").val() == "" ? 0 : $("[id='Oracle License_azure2").val(), Year3: $("[id='Oracle License_azure3']").val() == "" ? 0 : $("[id='Oracle License_azure3']").val(), Year4: $("[id='Oracle License_azure4']").val() == "" ? 0 : $("[id='Oracle License_azure4']").val(), Year5: $("[id='Oracle License_azure5']").val() == "" ? 0 : $("[id='Oracle License_azure5']").val() });
            EditCost.push({ Category: "Sa(Oracle)", Year1: $("[id='Sa(Oracle)_azure1']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure1']").val(), Year2: $("[id='Sa(Oracle)_azure2']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure2").val(), Year3: $("[id='Sa(Oracle)_azure3']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure3']").val(), Year4: $("[id='Sa(Oracle)_azure4']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure4']").val(), Year5: $("[id='Sa(Oracle)_azure5']").val() == "" ? 0 : $("[id='Sa(Oracle)_azure5']").val() });
            EditCost.push({ Category: "DR Cost", Year1: $("[id='DR Cost_azure1']").val() == "" ? 0 : $("[id='DR Cost_azure1']").val(), Year2: $("[id='DR Cost_azure2']").val() == "" ? 0 : $("[id='DR Cost_azure2").val(), Year3: $("[id='DR Cost_azure3']").val() == "" ? 0 : $("[id='DR Cost_azure3']").val(), Year4: $("[id='DR Cost_azure4']").val() == "" ? 0 : $("[id='DR Cost_azure4']").val(), Year5: $("[id='DR Cost_azure5']").val() == "" ? 0 : $("[id='DR Cost_azure5']").val() });
            EditCost.push({ Category: "Data Center", Year1: $("[id='Data Center_azure1']").val() == "" ? 0 : $("[id='Data Center_azure1']").val(), Year2: $("[id='Data Center_azure2']").val() == "" ? 0 : $("[id='Data Center_azure2").val(), Year3: $("[id='Data Center_azure3']").val() == "" ? 0 : $("[id='Data Center_azure3']").val(), Year4: $("[id='Data Center_azure4']").val() == "" ? 0 : $("[id='Data Center_azure4']").val(), Year5: $("[id='Data Center_azure5']").val() == "" ? 0 : $("[id='Data Center_azure5']").val() });
            EditCost.push({ Category: "Bandwidth", Year1: $("[id='Bandwidth_azure1']").val() == "" ? 0 : $("[id='Bandwidth_azure1']").val(), Year2: $("[id='Bandwidth_azure2']").val() == "" ? 0 : $("[id='Bandwidth_azure2").val(), Year3: $("[id='Bandwidth_azure3']").val() == "" ? 0 : $("[id='Bandwidth_azure3']").val(), Year4: $("[id='Bandwidth_azure4']").val() == "" ? 0 : $("[id='Bandwidth_azure4']").val(), Year5: $("[id='Bandwidth_azure5']").val() == "" ? 0 : $("[id='Bandwidth_azure5']").val() });
            EditCost.push({ Category: "Azure Advisor", Year1: $("[id='Azure Advisor_azure1']").val() == "" ? 0 : $("[id='Azure Advisor_azure1']").val(), Year2: $("[id='Azure Advisor_azure2']").val() == "" ? 0 : $("[id='Azure Advisor_azure2").val(), Year3: $("[id='Azure Advisor_azure3']").val() == "" ? 0 : $("[id='Azure Advisor_azure3']").val(), Year4: $("[id='Azure Advisor_azure4']").val() == "" ? 0 : $("[id='Azure Advisor_azure4']").val(), Year5: $("[id='Azure Advisor_azure5']").val() == "" ? 0 : $("[id='Azure Advisor_azure5']").val() });
            //EditCost.push({ Category: "Azure Security Center", Year1: $("[id='Azure Security Center_azure1']").val() == "" ? 0 : $("[id='Azure Security Center_azure1']").val(), Year2: $("[id='Azure Security Center_azure2']").val() == "" ? 0 : $("[id='Azure Security Center_azure2").val(), Year3: $("[id='Azure Security Center_azure3']").val() == "" ? 0 : $("[id='Azure Security Center_azure3']").val(), Year4: $("[id='Azure Security Center_azure4']").val() == "" ? 0 : $("[id='Azure Security Center_azure4']").val(), Year5: $("[id='Azure Security Center_azure5']").val() == "" ? 0 : $("[id='Azure Security Center_azure5']").val() });
            EditCost.push({ Category: "Azure Active Directory", Year1: $("[id='Azure Active Directory_azure1']").val() == "" ? 0 : $("[id='Azure Active Directory_azure1']").val(), Year2: $("[id='Azure Active Directory_azure2']").val() == "" ? 0 : $("[id='Azure Active Directory_azure2").val(), Year3: $("[id='Azure Active Directory_azure3']").val() == "" ? 0 : $("[id='Azure Active Directory_azure3']").val(), Year4: $("[id='Azure Active Directory_azure4']").val() == "" ? 0 : $("[id='Azure Active Directory_azure4']").val(), Year5: $("[id='Azure Active Directory_azure5']").val() == "" ? 0 : $("[id='Azure Active Directory_azure5']").val() });
            EditCost.push({ Category: "Application Gateway", Year1: $("[id='Application Gateway_azure1']").val() == "" ? 0 : $("[id='Application Gateway_azure1']").val(), Year2: $("[id='Application Gateway_azure2']").val() == "" ? 0 : $("[id='Application Gateway_azure2").val(), Year3: $("[id='Application Gateway_azure3']").val() == "" ? 0 : $("[id='Application Gateway_azure3']").val(), Year4: $("[id='Application Gateway_azure4']").val() == "" ? 0 : $("[id='Application Gateway_azure4']").val(), Year5: $("[id='Application Gateway_azure5']").val() == "" ? 0 : $("[id='Application Gateway_azure5']").val() });
            //EditCost.push({ Category: "Backup", Year1: $("[id='Backup_azure1']").val() == "" ? 0 : $("[id='Backup_azure1']").val(), Year2: $("[id='Backup_azure2']").val() == "" ? 0 : $("[id='Backup_azure2").val(), Year3: $("[id='Backup_azure3']").val() == "" ? 0 : $("[id='Backup_azure3']").val(), Year4: $("[id='Backup_azure4']").val() == "" ? 0 : $("[id='Backup_azure4']").val(), Year5: $("[id='Backup_azure5']").val() == "" ? 0 : $("[id='Backup_azure5']").val() });
            EditCost.push({ Category: "Traffic Manager", Year1: $("[id='Traffic Manager_azure1']").val() == "" ? 0 : $("[id='Traffic Manager_azure1']").val(), Year2: $("[id='Traffic Manager_azure2']").val() == "" ? 0 : $("[id='Traffic Manager_azure2").val(), Year3: $("[id='Traffic Manager_azure3']").val() == "" ? 0 : $("[id='Traffic Manager_azure3']").val(), Year4: $("[id='Traffic Manager_azure4']").val() == "" ? 0 : $("[id='Traffic Manager_azure4']").val(), Year5: $("[id='Traffic Manager_azure5']").val() == "" ? 0 : $("[id='Traffic Manager_azure5']").val() });
            EditCost.push({ Category: "Network Watcher", Year1: $("[id='Network Watcher_azure1']").val() == "" ? 0 : $("[id='Network Watcher_azure1']").val(), Year2: $("[id='Network Watcher_azure2']").val() == "" ? 0 : $("[id='Network Watcher_azure2").val(), Year3: $("[id='Network Watcher_azure3']").val() == "" ? 0 : $("[id='Network Watcher_azure3']").val(), Year4: $("[id='Network Watcher_azure4']").val() == "" ? 0 : $("[id='Network Watcher_azure4']").val(), Year5: $("[id='Network Watcher_azure5']").val() == "" ? 0 : $("[id='Network Watcher_azure5']").val() });
            EditCost.push({ Category: "Loadbalancer", Year1: $("[id='Loadbalancer_azure1']").val() == "" ? 0 : $("[id='Loadbalancer_azure1']").val(), Year2: $("[id='Loadbalancer_azure2']").val() == "" ? 0 : $("[id='Loadbalancer_azure2").val(), Year3: $("[id='Loadbalancer_azure3']").val() == "" ? 0 : $("[id='Loadbalancer_azure3']").val(), Year4: $("[id='Loadbalancer_azure4']").val() == "" ? 0 : $("[id='Loadbalancer_azure4']").val(), Year5: $("[id='Loadbalancer_azure5']").val() == "" ? 0 : $("[id='Loadbalancer_azure5']").val() });
            EditCost.push({ Category: "Express Route", Year1: $("[id='Express Route_azure1']").val() == "" ? 0 : $("[id='Express Route_azure1']").val(), Year2: $("[id='Express Route_azure2']").val() == "" ? 0 : $("[id='Express Route_azure2").val(), Year3: $("[id='Express Route_azure3']").val() == "" ? 0 : $("[id='Express Route_azure3']").val(), Year4: $("[id='Express Route_azure4']").val() == "" ? 0 : $("[id='Express Route_azure4']").val(), Year5: $("[id='Express Route_azure5']").val() == "" ? 0 : $("[id='Express Route_azure5']").val() });
            EditCost.push({ Category: "Virtual Network", Year1: $("[id='Virtual Network_azure1']").val() == "" ? 0 : $("[id='Virtual Network_azure1']").val(), Year2: $("[id='Virtual Network_azure2']").val() == "" ? 0 : $("[id='Virtual Network_azure2").val(), Year3: $("[id='Virtual Network_azure3']").val() == "" ? 0 : $("[id='Virtual Network_azure3']").val(), Year4: $("[id='Virtual Network_azure4']").val() == "" ? 0 : $("[id='Virtual Network_azure4']").val(), Year5: $("[id='Virtual Network_azure5']").val() == "" ? 0 : $("[id='Virtual Network_azure5']").val() });
            EditCost.push({ Category: "IP Addresses", Year1: $("[id='IP Addresses_azure1']").val() == "" ? 0 : $("[id='IP Addresses_azure1']").val(), Year2: $("[id='IP Addresses_azure2']").val() == "" ? 0 : $("[id='IP Addresses_azure2").val(), Year3: $("[id='IP Addresses_azure3']").val() == "" ? 0 : $("[id='IP Addresses_azure3']").val(), Year4: $("[id='IP Addresses_azure4']").val() == "" ? 0 : $("[id='IP Addresses_azure4']").val(), Year5: $("[id='IP Addresses_azure5']").val() == "" ? 0 : $("[id='IP Addresses_azure5']").val() });
            //EditCost.push({ Category: "VPN Gateway", Year1: $("[id='VPN Gateway_azure1']").val() == "" ? 0 : $("[id='VPN Gateway_azure1']").val(), Year2: $("[id='VPN Gateway_azure2']").val() == "" ? 0 : $("[id='VPN Gateway_azure2").val(), Year3: $("[id='VPN Gateway_azure3']").val() == "" ? 0 : $("[id='VPN Gateway_azure3']").val(), Year4: $("[id='VPN Gateway_azure4']").val() == "" ? 0 : $("[id='VPN Gateway_azure4']").val(), Year5: $("[id='VPN Gateway_azure5']").val() == "" ? 0 : $("[id='VPN Gateway_azure5']").val() });
            EditCost.push({ Category: "Log Analytics", Year1: $("[id='Log Analytics_azure1']").val() == "" ? 0 : $("[id='Log Analytics_azure1']").val(), Year2: $("[id='Log Analytics_azure2']").val() == "" ? 0 : $("[id='Log Analytics_azure2").val(), Year3: $("[id='Log Analytics_azure3']").val() == "" ? 0 : $("[id='Log Analytics_azure3']").val(), Year4: $("[id='Log Analytics_azure4']").val() == "" ? 0 : $("[id='Log Analytics_azure4']").val(), Year5: $("[id='Log Analytics_azure5']").val() == "" ? 0 : $("[id='Log Analytics_azure5']").val() });
            EditCost.push({ Category: "Key Vault", Year1: $("[id='Key Vault_azure1']").val() == "" ? 0 : $("[id='Key Vault_azure1']").val(), Year2: $("[id='Key Vault_azure2']").val() == "" ? 0 : $("[id='Key Vault_azure2").val(), Year3: $("[id='Key Vault_azure3']").val() == "" ? 0 : $("[id='Key Vault_azure3']").val(), Year4: $("[id='Key Vault_azure4']").val() == "" ? 0 : $("[id='Key Vault_azure4']").val(), Year5: $("[id='Key Vault_azure5']").val() == "" ? 0 : $("[id='Key Vault_azure5']").val() });
            EditCost.push({ Category: "Storage hardware cost", Year1: $("[id='Storage hardware cost_azure1']").val() == "" ? 0 : $("[id='Storage hardware cost_azure1']").val(), Year2: $("[id='Storage hardware cost_azure2']").val() == "" ? 0 : $("[id='Storage hardware cost_azure2").val(), Year3: $("[id='Storage hardware cost_azure3']").val() == "" ? 0 : $("[id='Storage hardware cost_azure3']").val(), Year4: $("[id='Storage hardware cost_azure4']").val() == "" ? 0 : $("[id='Storage hardware cost_azure4']").val(), Year5: $("[id='Storage hardware cost_azure5']").val() == "" ? 0 : $("[id='Storage hardware cost_azure5']").val() });
            EditCost.push({ Category: "Backup and Archive cost", Year1: $("[id='Backup and Archive cost_azure1']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure1']").val(), Year2: $("[id='Backup and Archive cost_azure2']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure2").val(), Year3: $("[id='Backup and Archive cost_azure3']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure3']").val(), Year4: $("[id='Backup and Archive cost_azure4']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure4']").val(), Year5: $("[id='Backup and Archive cost_azure5']").val() == "" ? 0 : $("[id='Backup and Archive cost_azure5']").val() });
            EditCost.push({ Category: "IT Labor", Year1: $("[id='IT Labor_azure1']").val() == "" ? 0 : $("[id='IT Labor_azure1']").val(), Year2: $("[id='IT Labor_azure2']").val() == "" ? 0 : $("[id='IT Labor_azure2").val(), Year3: $("[id='IT Labor_azure3']").val() == "" ? 0 : $("[id='IT Labor_azure3']").val(), Year4: $("[id='IT Labor_azure4']").val() == "" ? 0 : $("[id='IT Labor_azure4']").val(), Year5: $("[id='IT Labor_azure5']").val() == "" ? 0 : $("[id='IT Labor_azure5']").val() });

            $.ajax({
                url: "TCOCalculator.aspx/SaveAzureEditData",
                type: 'post',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify({ Editlist: EditCost }),
                dataType: 'json',
                async: false,
                success: function (data) {
                },
                error: function (request, error) {
                    console.log(arguments);
                }
            });
        }


    };
    $scope.savedata = function () {
        $scope.UpdateAssumption();
    };
    $scope.saveAzuredata = function () {

        $scope.UpdateAzureAssumption();
    };
    $scope.savecustomerdata = function () {
        var dataid = Id;
        $.ajax({
            url: "TCOCalculator.aspx/CheckCurrency",
            type: 'post',
            contentType: 'application/json; charset=UTF-8',
            data: '{ID:"' + dataid + '"}',
            dataType: 'json',
            async: false,
            success: function (data) {
                if (data.d == true) {
                    $scope.UpdateCustomerAssumption();
                }
                else {
                    alert("Your Assumptions is not reflected due to Currency mismatch");
                    $('#EditPopup1').modal('toggle');
                }
            },
            error: function (data) {
            },
            complete: function (data) {

            },
        });
    };
    $scope.UpdateCustomerAssumption = function () {
        var AD = sampleService.UserCostSavedInDb;
        if (AD === undefined || AD.length > 0) {
            $scope.saveEditCustomerAssumption();

        }
    };
    $scope.ResetData = function () {

        var AD = sampleService.UserCostSavedInDb;
        if (AD === undefined || AD.length > 0) {
            $("#MyPopup .modal-title").html("Cloud Recon");
            $("#MyPopup .modal-body").html("Are you want to sure reset your previous saved filter data ?");
            $("#MyPopup").modal("show");
        }
        else { $scope.ResetData1(); }

    };
    $scope.HidePopup = function () {
        $("#MyPopup").modal("hide");
    };
    $scope.EditAssumption = function () {
        $("#EditPopup").modal("show");
    };
    $scope.EditAssumptiondata = function () {
        $("#EditPopup1").modal("show");
    };
    $scope.EditAzureAssumption = function () {
        $("#EditAzurePopup").modal("show");
    };
    $scope.ResetData1 = function () {
        $("#MyPopup").modal("hide");
        $scope.loader = true;
        $http.post('TCOCalculator.aspx/ResetFilterInDB', {}).then(function (response) {
            $scope.loader = false;
            location.reload();
        }, function (error) {
            console.log(error);
        });
    };
    $scope.ResetCustomerData = function () {
        var AD = sampleService.UserCostSavedInDb;
        if (AD === undefined || AD.length > 0) {
            $("#MyPopupReset .modal-title").html("Cloud Recon");
            $("#MyPopupReset .modal-body").html("Your saved data will get reset, are you sure to reset it?");
            $("#MyPopupReset").modal("show");
        }
        else { $scope.ResetSaveData(); }

    };
    $scope.ResetSaveData = function () {
        $("#MyPopupReset").modal("hide");
        $scope.loader = true;
        $http.post('TCOCalculator.aspx/ResetSaveCost', {}).then(function (response) {
            $scope.loader = false;
            location.reload();
        }, function (error) {
            console.log(error);
        });
    };
});
app.controller("On_premises_cost_breakdown_summaryController", function ($scope, sampleService, DTOptionsBuilder) {
    $scope.CostBreakDown = [];
    $scope.$on('On_premises_cost_breakdown_summaryBind', function (event, config) {
        $scope.TotalSoftwarecostLinux = [];
        $scope.TotalSoftwarecostWindows = [];
        $scope.IsUserCostSavedStatus1 = sampleService.IsUserCostSavedStatus1;
        $scope.IsAzureCostSavedStatus = sampleService.IsAzureCostSavedStatus;
        $scope.IsFilterReset = sampleService.IsFilterReset;
        viewMoreDetailFunction(sampleService, $scope);
        $scope.MigrationAssumptions = sampleService.MigrationAssumptions;
        //$scope.PricePerKiloWatt = sampleService.PricePerKiloWatt;
        $scope.PricePerKiloWatt = 0.1334;
        $scope.DataCenterConfig = config.config[0].DataCenterConfig;
        $scope.DataCenterConfig.DataCenterConstructionCost = sampleService.DataCenterConstructionCost;
        $scope.NetworkingCost = sampleService.NetworkingCost;
        $scope.ItlabourCosts = sampleService.ItlabourCosts;
        $scope.StorageCost = sampleService.StorageCost;
        $scope.databaseCost = sampleService.Assumptions.databaseCost;
        $scope.oracledatabaseCost = sampleService.Assumptions.OracleDbCost;
        $scope.AzureCostCalulation = config.config[0].AzureCostCalulation;
        $scope.AzureNetworkConfig = sampleService.AzureNetworkingCost;
        $scope.Load = sampleService.Load;
        $scope.ReconLiftandShift_InputData = sampleService.ReconLiftandShift_InputData;
        $scope.ReconLiftandShift_BackUpStorage = sampleService.ReconLiftandShift_BackUpStorage;
        $scope.Recon_OracleToPostgreData = sampleService.Recon_OracleToPostgreData;
        $scope.storageGrowth = sampleService.storageGrowth;
        $scope.azurePageBlobStorageCost = sampleService.azurePageBlobStorageCost;
        $scope.BanchMark = sampleService.Tbl_BenchmarkPricing;
        $scope.Alldata = sampleService;
        $scope.VirtualizationCost = sampleService.VirtualizationCost;
        if (sampleService.IsUserCostSavedStatus == true) {
            var load = { Total: {}, ServerModelList: [] };
            angular.forEach(sampleService.UserCostSavedInDbphysicalserver, function (value, key) {
                load.ServerModelList.push(value);
            });

            $scope.PhySer = load;
        }
        else {
            $scope.PhySer = Workload($scope.Alldata);
        }
        $scope.Stor = sampleService.IsUserCostSavedStatus == true ? sampleService.SaveStoragedata.length > 0 ? $scope.PhySer.ServerModelList : sampleService.ServerAssumptions : sampleService.ServerAssumptions;
        $scope.Datab = sampleService.DatabaseAssumptions;
        $scope.DbBanchMark = sampleService.SQLServerAssumption;
        //  $scope.EndPointProtectionBanchMark = sampleService.CostOfEndPointProtection;
        $scope.StorageBanchMark = sampleService.Tbl_StorageCostAssumption;
        $scope.vw_SQLVersionLicenseDetail = sampleService.vw_SQLVersionLicenseDetail;
        $scope.vw_OracleVersionLicenseDetail = sampleService.vw_OracleVersionLicenseDetail;
        $scope.vw_AzureOracleCost = sampleService.vw_AzureOracleCost;
        $scope.vw_SQLVersionLicenseDetailTemp = SqlVersionCostCalculation(sampleService.vw_SQLVersionLicenseDetail, $scope.databaseCost);
        $scope.vw_OracleVersionLicenseDetailTemp = OracleVersionCostCalculation(sampleService.vw_OracleVersionLicenseDetail, $scope.oracledatabaseCost);
        sampleService.PhySer = $scope.PhySer;
        $scope.SoftwareCostAssump = sampleService.softCostAssumption;
        $scope.tcoType = sampleService.tcoType;
        $scope.sqlType = sampleService.sqlType;
        $scope.sqlTypeText = ($scope.sqlType === 'vcore' ? 'VCore' : $scope.sqlType === 'instancepool' ? 'Instance Pool' : $scope.sqlType === 'elasticpool' ? 'Elastic Pool' : 'MI');
        $scope.planNewPostgre = sampleService.planNewPostgre === undefined || sampleService.planNewPostgre === null ? 'threeyear' : sampleService.planNewPostgre;
        $scope.planNew = sampleService.planNew === undefined || sampleService.planNew === null ? 'threeyearhybrid' : sampleService.planNew;
        $scope.plan = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
        $scope.TotalVMMigration = sampleService.ReconLiftandShift_InputData.length;
        sampleService.TotalVMMigration = $scope.TotalVMMigration;
        $scope.serverGrowth = sampleService.serverGrowth;
        sampleService.serverGrowth = $scope.serverGrowth;
        //Azure Storage Cost
        $scope.azurePageBlobStorageCost = sampleService.azurePageBlobStorageCost;
        sampleService.azurePageBlobStorageCost = $scope.azurePageBlobStorageCost;
        //
        $scope.VMThroughputRate = sampleService.VMThroughputRate;
        sampleService.VMThroughputRate = $scope.VMThroughputRate;
        $scope.VMPer = sampleService.VMPer;
        sampleService.VMPer = $scope.VMPer;
        $scope.CostofCapitalPer = sampleService.CostofCapitalPer;
        sampleService.CostofCapitalPer = $scope.CostofCapitalPer;
        $scope.BenefitsRealizedRate0 = sampleService.BenefitsRealizedRate0;
        $scope.BenefitsRealizedRate1 = sampleService.BenefitsRealizedRate1;
        $scope.BenefitsRealizedRate2 = sampleService.BenefitsRealizedRate2;
        $scope.BenefitsRealizedRate3 = sampleService.BenefitsRealizedRate3;
        $scope.BenefitsRealizedRate4 = sampleService.BenefitsRealizedRate4;
        sampleService.CurrentYear = 0;
        $scope.consultantCost = function () {
            var b;
            if (sampleService.TotalVMMigration * 3.2 < 40) {
                b = 40;
                return b;
            }
            else {
                b = Math.ceil(sampleService.TotalVMMigration * 3.2)
                return b;
            }

        }
        $scope.SetMigrationAssumptions = function (EAhours) {
            sampleService.MigrationAssumptions[0].subItems[0].value0 = EAhours.MigrationAssumptions[0].subItems[0].value0;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService);
        };
        $scope.SetInternalMigrationAssumptions = function (EAhours) {
            sampleService.MigrationAssumptions[0].subItems[2].value2 = EAhours.MigrationAssumptions[0].subItems[2].value2;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService)
        };
        $scope.SetStorageMigrationAssumptions = function (EAhours) {
            sampleService.MigrationAssumptions[0].subItems[1].value1 = EAhours.MigrationAssumptions[0].subItems[1].value1;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService)
        };
        $scope.SetProjectMigrationAssumptions = function (EAhours) {
            sampleService.MigrationAssumptions[0].subItems[3].value3 = EAhours.MigrationAssumptions[0].subItems[3].value3;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService)
        };
        $scope.SetAssesmentCostVM = function (EAhours) {
            sampleService.MigrationAssumptions[0].subItems[4].value4 = EAhours.MigrationAssumptions[0].subItems[4].value4;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService)
        };
        $scope.SetLiftShiftCostVM = function (EAhours) {
            sampleService.MigrationAssumptions[0].subItems[5].value5 = EAhours.MigrationAssumptions[0].subItems[5].value5;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService)
        };
        $scope.TotalAzureNetworkingCost = function () {
            var Total = 0;
            if (sampleService.IsUserCostSavedStatus1 == true) {
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if (value.Type === "Bandwidth" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "Azure Advisor" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    //else if (value.Type === "Azure Security Center" && value.Year.search('1') === 0) {
                    //    Total += value.Azure;
                    //}
                    else if (value.Type === "Azure Active Directory" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "Application Gateway" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    //else if (value.Type === "Backup" && value.Year.search('1') === 0) {
                    //    Total += value.Azure;
                    //}
                    else if (value.Type === "Traffic Manager" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "Network Watcher" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "Loadbalancer" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "Express Route" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "Virtual Network" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "IP Addresses" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    //else if (value.Type === "VPN Gateway" && value.Year.search('1') === 0) {
                    //    Total += value.Azure;
                    //}
                    else if (value.Type === "Log Analytics" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                    else if (value.Type === "Key Vault" && value.Year.search('1') === 0) {
                        Total += value.Azure;
                    }
                });
            }
            else {
                if (sampleService.ReconLiftandShift_InputData.length > 0)
                    Total = (TotalAzureNetworkCost(sampleService.AzureNetworkingCost, $scope.NumberOfYears, sampleService.CurrencyTableTemp));
                else
                    Total = 0;
            }
            return Total;
        };
        $scope.benifit = 'renting';
        sampleService.benifit = $scope.benifit;
        $scope.SetType = function (Type) {
            $scope.Type = Type;

        };
        if (typeof sampleService.ServerAssumptions === undefined || sampleService.ServerAssumptions === null) {
            $scope.$emit('loadAgain', []);
        }
        $scope.TotalServersCount = sampleService.ServerAssumptions.length;
        sampleService.NumberOfYears = $scope.NumberOfYears;
        $scope.years = sampleService.years;
        sampleService.years = $scope.years;
        $scope.ServerModelList = Workload(sampleService);
        $scope.TotalElectricityCost = function () {
            var TotalPowerRating = 0;
            angular.forEach(config.config[0].ElectricityConfig, function (value, key) {
                TotalPowerRating += value.PowerRating;
            });
            return ((TotalPowerRating / 1000) * ($scope.PricePerKiloWatt) * 732 * 12);
        };
        $scope.TotalPowerRating = function () {
            var total = 0;
            angular.forEach(config.config[0].ElectricityConfig, function (value, key) {
                total += value.PowerRating;
            });
            return total / 1000;
        };
        $scope.DatabaseAssumptions = sampleService.DatabaseAssumptions;
        sampleService.Assumptions.MigrationAssumptions = sampleService.MigrationAssumptions;
        var type = $scope.NumberOfYears == 1 ? "payasyougo" : $scope.NumberOfYears == 2 ? "oneyear" : "threeyear";
        function MathPow(Base, Exponent) {
            return Math.pow(Base, Exponent);
        };
        sampleService.CoustumerInput = sampleService.ServerAssumptions;
        $scope.StorageObject = [
            { label: "Total Storage (GB) - compute (Annual)", value: GetTotalStorageInGB(sampleService.ServerAssumptions), valueDes: '' },
            { label: "Total Storage (GB) - Backup (Annual)", value: (GetTotalStorageInGB(sampleService.ServerAssumptions)) * 10 / 100, valueDes: 'Assuming 10% storage backup' },
            { label: "Storage Growth rate (%) - YoY", value: sampleService.serverGrowth, valueDes: 'Assumption' },
        ];
        sampleService.StorageObject = $scope.StorageObject;
        $scope.AzureVmCost = function (type) {
            var Total, C, cost, C1, Total1, PostgreSQLCost, SQLCost;
            if (sampleService.CurrentYear == 0)
                if (sampleService.tcoType == "postgre") {
                    return (TotalAzureVmCost(config.config[0].AzureCostCalulation.AzureCompute[0].Items, $scope.NumberOfYears, type) - TotalLiftandShiftPostgreSQLCost(config.config[0].AzureCostCalulation.AzureCompute[5].Items, $scope.NumberOfYears, type));
                }
                else if (sampleService.tcoType == "sql") {
                    return (TotalAzureVmCost(config.config[0].AzureCostCalulation.AzureCompute[0].Items, $scope.NumberOfYears, type)) //- TotalLiftandShiftSQLCost(config.config[0].AzureCostCalulation.AzureCompute[6].Items, $scope.NumberOfYears, type));
                }
                else {
                    return TotalAzureVmCost(config.config[0].AzureCostCalulation.AzureCompute[0].Items, $scope.NumberOfYears, type);
                }
            else {
                if (sampleService.tcoType == "postgre") {
                    cost = TotalAzureVmCost(config.config[0].AzureCostCalulation.AzureCompute[0].Items, $scope.NumberOfYears, type);
                    C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                    Total = (cost + C);
                    PostgreSQLCost = TotalLiftandShiftPostgreSQLCost(config.config[0].AzureCostCalulation.AzureCompute[5].Items, $scope.NumberOfYears, type);
                    C1 = PostgreSQLCost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                    Total1 = (PostgreSQLCost + C1);
                    return (Total - Total1);
                }
                else if (sampleService.tcoType == "sql") {
                    cost = TotalAzureVmCost(config.config[0].AzureCostCalulation.AzureCompute[0].Items, $scope.NumberOfYears, type);
                    C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                    Total = (cost + C);
                    SQLCost = TotalLiftandShiftSQLCost(config.config[0].AzureCostCalulation.AzureCompute[5].Items, $scope.NumberOfYears, type);
                    C1 = SQLCost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                    Total1 = (Cost + C1);
                    return (Total);
                }
                else {
                    cost = TotalAzureVmCost(config.config[0].AzureCostCalulation.AzureCompute[0].Items, $scope.NumberOfYears, type);
                    C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                    Total = (cost + C);
                    return Total;
                }
            }
        };
        $scope.AzureSqlCost = function (type) {
            if (sampleService.CurrentYear == 0)
                return TotalAzureSqlCost(sampleService.AzureCostCalulation.AzureCompute[1].Items, $scope.NumberOfYears, type);
            else {
                var cost = TotalAzureSqlCost(sampleService.AzureCostCalulation.AzureCompute[1].Items, $scope.NumberOfYears, type);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C)
                return Total;
            }
        };
        $scope.AzureLinuxCost = function (type) {

            if (sampleService.CurrentYear == 0)
                return TotalAzureLinuxCost(sampleService.AzureCostCalulation.AzureCompute[2].Items, $scope.NumberOfYears, type);
            else {
                var cost = TotalAzureLinuxCost(sampleService.AzureCostCalulation.AzureCompute[2].Items, $scope.NumberOfYears, type);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C)
                return Total;
            }
        };
        $scope.AzureBiztalkCost = function (type) {
            if (sampleService.CurrentYear == 0)
                return TotalAzureBiztalkCost(config.config[0].AzureCostCalulation.AzureCompute[3].Items, $scope.NumberOfYears, type);
            else {
                var cost = TotalAzureBiztalkCost(config.config[0].AzureCostCalulation.AzureCompute[3].Items, $scope.NumberOfYears, type);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C)
                return Total;
            }
        };
        $scope.AzurePostgreSQLCost = function (type) {
            if (sampleService.CurrentYear == 0)
                return TotalAzurePostgreSQLCost(config.config[0].AzureCostCalulation.AzureCompute[4].Items, $scope.NumberOfYears, type);
            else {
                var cost = TotalAzurePostgreSQLCost(config.config[0].AzureCostCalulation.AzureCompute[4].Items, $scope.NumberOfYears, type);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total;
            }
        };
        $scope.AzureItLabourCost = function () {
            if (sampleService.ReconLiftandShift_InputData.length > 0) {
                var TotalVm = $scope.TotalPhysicalServers('physicalserver') + $scope.TotalPhysicalServers('virtualmachine');
                return ((TotalVm * (2000 / $scope.ItlabourCosts.TotalVmsManagedByAdmin)) * $scope.ItlabourCosts.HourlyRate);
            }
            else {
                return 0;
            }
        };
        $scope.TotalUsedTapdrive = function () {
            var total = GetTotalUsedTapdrive(sampleService.ServerAssumptions);
            return total;
        };
        $scope.TotalStorageInGB = function () {
            var total = GetTotalStorageInGB(sampleService.ServerAssumptions);

            return total;
        };
        $scope.TotalStorageCost = function () {
            var storage_procurement_cost = GetTotalStorageInGB(sampleService.StorageAssumptions) * sampleService.StorageCost[0].Cost;
            return total = storage_procurement_cost;
            // return total;
        };
        $scope.TotalHardwareCost = function () {
            if (sampleService.CurrentYear == 0) {
                var Total = GetTotalHardwareCost(Workload(sampleService).ServerModelList, $scope.NumberOfYears, sampleService);
                return Total / sampleService.years;
            }
            else {
                var C = GetTotalHardwareCost(Workload(sampleService).ServerModelList, $scope.NumberOfYears, sampleService) * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (GetTotalHardwareCost(Workload(sampleService).ServerModelList, $scope.NumberOfYears, sampleService) + C)
                return Total / sampleService.years;
            }
        };
        $scope.TotalVirtualizationCost = function () {
            var total = 0;
            angular.forEach(sampleService.HostMachineDetail, function (value, key) {
                total += (value.TargetProcessor * $scope.VirtualizationCost.TotalVmsManagedByAdmin) + (value.VMCount * $scope.VirtualizationCost.TotalPhysicalServerManagedByAdmin * 12);
            });
            return total / 5;
        };
        $scope.CalculateOnPremDRCost = function () {
            if ($('#ContentPlaceHolder1_TCOAnalysisReport_Assumptions1_includeBackupDRCost').is(':checked')) {

                var totalDrCost = 0;
                var totalCompute = 0;
                var totalDataCenter = 0;
                var totalNetworking = 0;
                var totalStorage = 0;
                var itLabour = 0;
                totalCompute = ($scope.TotalHardwareCost()) + ($scope.TotalHardwareMaintanenceCost()) + ($scope.TotalVirtualizationCost()) + ($scope.TotalDatabaseCost())
                    + ($scope.TotalElectricityCost()) + ($scope.TotalSASqlCost()) + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig))
                    + ($scope.TotalSoftwareLinuxCost(config.config[0].SoftwareConfig)) + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100)
                    + $scope.TotalOracleDatabaseCost() + (($scope.TotalOracleDatabaseCost()) * 22 / 100);
                totalDataCenter = Math.round($scope.DataCenterCost() * 100) / 100;
                totalNetworking = Math.round($scope.OnPremiseTotalsNetworkingCost() * 100) / 100;
                totalStorage = (Math.round(($scope.StorageHardWareCost()) * 100) / 100) +
                    (Math.round(($scope.BackupAndArchiveCost()) * 100) / 100) + (Math.round(($scope.StorageMaintenanceCost()) * 100) / 100);
                itLabour = Math.round($scope.ItLabourGrouth() * 100) / 100;
                totalDrCost = totalCompute + totalDataCenter + totalNetworking + totalStorage + itLabour
                return totalDrCost * sampleService.StorageCost[2].Cost;

            }
            else {
                return 0.00;
            }
        };

        $scope.VirtualServerWithoutHostCount = sampleService.VirtualServerWithoutHostCount;
        $scope.VirtualServerCost = sampleService.VirtualServerCost;
        $scope.TotalBizTalkCost = function () {
            if (sampleService.CurrentYear == 0)
                return GetTotalBizTalkCost(Workload(sampleService).ServerModelList, $scope.NumberOfYears) * 2 / sampleService.years;
            else {
                var C = GetTotalBizTalkCost(Workload(sampleService).ServerModelList, $scope.NumberOfYears) * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (GetTotalHardwareCost(Workload(sampleService).ServerModelList, $scope.NumberOfYears, sampleService) + C)
                return Total * 2 / sampleService.years;
            }
        };
        $scope.TotalSoftwareCost = function () {
            var total = $scope.TotalSoftwareLinuxCost(config.config[0].SoftwareConfig) + $scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig)
                 + $scope.TotalSASqlCost() 
               + (($scope.TotalOracleDatabaseCost()) * 22 / 100) + ((($scope.CalculateOnPremDRCost()) * 100) / 100);
            return total;
        }

        //Storage Cost Calculation
        $scope.StorageHardWareCost = function () {
            var cost = 0;
            cost = ($scope.TotalStorageInGB() * sampleService.StorageCost[0].Cost);
            return cost / 5;
        };
        $scope.BackupAndArchiveCost = function () {
            if ($('#ContentPlaceHolder1_TCOAnalysisReport_Assumptions1_includeBackupDRCost').is(':checked')) {
                var cost = 0;
                cost = ($scope.TotalUsedTapdrive() * (sampleService.StorageCost[1].Cost));
                return cost;
            }
            else {
                return 0.00
            }
        };
        $scope.StorageMaintenanceCost = function () {
            var cost = 0;
            cost = (($scope.TotalStorageInGB() * sampleService.StorageCost[0].Cost) * 10 / 100);
            return cost;
        };
        //Azure Storage
        $scope.PageBlobStorageCost = function () {
            var cost = 0;
            cost = (($scope.TotalStorageInGB() * (sampleService.azurePageBlobStorageCost)));
            return cost = cost;
        };
        //End
        $scope.GetTotalRackRequired = function () {
            var Total = 0;
            angular.forEach(config.config[0].DataCenterConfig, function (value, key) {
                Total += value.RackUnitsRequired * value.TotalServer;
            });
            angular.forEach(sampleService.HostMachineDetail, function (value, key) {
                Total += value.RackRequired;
            });
            return Total;
        };
        $scope.TotalServers = function () {
            var Total = 0;
            angular.forEach(config.config[0].DataCenterConfig, function (value, key) {
                Total += value.TotalServer;
            });
            return Total;
        };
        $scope.TotalEnterpriseLicenseCores = function () {
            return GetTotalEnterpriseLicenseCores(sampleService.DatabaseAssumptions);
        };
        $scope.TotalStandardLicensCores = function () {
            return GetTotalStandardLicensCores(sampleService.DatabaseAssumptions);
        };
        $scope.DatabaseLicenseCost = function (License) {
            return GetDatabaseLicenseCost(sampleService.Assumptions.databaseCost, License);
        };
        $scope.TotalDatabaseCost = function () {
            if (sampleService.CurrentYear == 0)
                return GetTotalDatabaseCost1(sampleService.Assumptions.databaseCost, sampleService.vw_SQLVersionLicenseDetail) / sampleService.years;
            else {
                var cost = GetTotalDatabaseCost1(sampleService.Assumptions.databaseCost, sampleService.DatabaseAssumptions, $scope.NumberOfYears);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total / sampleService.years;
            }
        };
        $scope.TotalSASqlCost = function () {
            if (sampleService.CurrentYear == 0)
                return GetTotalSASqlCost(sampleService.Assumptions.databaseCost, sampleService.vw_SQLVersionLicenseDetail, sampleService.years) / sampleService.years;
            else {
                var cost = GetTotalSASqlCost(sampleService.Assumptions.databaseCost, sampleService.vw_SQLVersionLicenseDetail, sampleService.years);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total / sampleService.years;
            }
        };
        //Oracle
        $scope.TotalOracleDatabaseCost = function () {
            if (sampleService.CurrentYear == 0)
                return GetTotalOracleDatabaseCost1(sampleService.Assumptions.OracleDbCost, sampleService.vw_OracleVersionLicenseDetail) / sampleService.years;
            else {
                var cost = GetTotalOracleDatabaseCost1(sampleService.Assumptions.oracledatabaseCost, sampleService.vw_OracleVersionLicenseDetail);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total / sampleService.years;
            }
        };
        //AzureOracleCost
        $scope.TotalAzureOracleCost = function () {
            if (sampleService.CurrentYear == 0)
                return GetAzureOracleCost1(sampleService.Assumptions.OracleDbCost, sampleService.vw_AzureOracleCost) / sampleService.years;
            else {
                var cost = GetAzureOracleCost1(sampleService.Assumptions.oracledatabaseCost, sampleService.vw_AzureOracleCost);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total / sampleService.years;
            }
        };
        $scope.GetReconLiftandShiftDRStorage = function () {
            if ($('#ContentPlaceHolder1_TCOAnalysisReport_Assumptions1_includeBackupDRCost').is(':checked')) {
                if (sampleService.CurrentYear == 0)
                    return GetReconLiftandShiftDRCostCalculation(sampleService.ReconLiftandShift_BackUpStorage, sampleService.CurrencyTableTemp);
                else {
                    var cost = GetReconLiftandShiftDRCostCalculation(sampleService.ReconLiftandShift_BackUpStorage, sampleService.CurrencyTableTemp);
                    var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                    var Total = (cost + C);
                    return Total / sampleService.years;
                }
            }
            else {
                return 0.00
            }
        };
        $scope.GetReconLiftandShiftBackupStorage = function () {
            if ($('#ContentPlaceHolder1_TCOAnalysisReport_Assumptions1_includeBackupDRCost').is(':checked')) {
                if (sampleService.CurrentYear == 0)
                    return GetReconLiftandShiftBackupCostCalculation(sampleService.ReconLiftandShift_BackUpStorage, sampleService.CurrencyTableTemp);
                else {
                    var cost = GetReconLiftandShiftBackupCostCalculation(sampleService.ReconLiftandShift_BackUpStorage, sampleService.CurrencyTableTemp);
                    var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                    var Total = (cost + C);
                    return Total / sampleService.years;
                }
            }
            else {
                return 0.00
            }
        };

        $scope.DataCenterCost = function () {
            var Total = 0;
            var cost = ($scope.DataCenterConfig.DataCenterConstructionCost.constructionCost / $scope.DataCenterConfig.DataCenterConstructionCost.Life * $scope.NumberOfYears)
                * ($scope.GetTotalRackRequired() / $scope.DataCenterConfig.DataCenterConstructionCost.UnitsPerRack);
            if (sampleService.CurrentYear == 0) {
                return cost;
            }
            else {
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                Total = (cost + C)
                return Total;
            }
        };
        $scope.TotalNetworkHardwareSoftwarecost = function () {
            var Cost = $scope.TotalHardwareCost() + $scope.TotalHardwareMaintanenceCost() + $scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) +
                $scope.TotalDatabaseCost() + $scope.TotalSASqlCost() + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * (sampleService.sa / 100)) +
                $scope.TotalSoftwareLinuxCost(config.config[0].SoftwareConfig) + $scope.TotalOracleDatabaseCost() + (($scope.TotalOracleDatabaseCost()) * 22 / 100);
            var totalCost = Cost * sampleService.NetworkingCost[0].Value / 100;
            var C = totalCost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
            var Total = (totalCost + C);
            return Total;
        };
        $scope.TotalNetworkMaintainanceCost = function () {
            var totalCost = $scope.TotalNetworkHardwareSoftwarecost() * sampleService.NetworkingCost[2].Value / 100;
            var C = totalCost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
            var Total = (totalCost + C);
            return Total;
        };
        $scope.OnPremiseTotalsNetworkingCost = function () {
            var totalCost = $scope.TotalNetworkHardwareSoftwarecost() + $scope.TotalNetworkMaintainanceCost()
                + (sampleService.NetworkingCost[1].Value * $scope.NetworkingBandwidth() * 12 * $scope.NumberOfYears);
            var C = totalCost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
            var Total = (totalCost + C);
            return Total;
        };
        $scope.TotalHardwareMaintanenceCost = function () {
            return (($scope.TotalHardwareCost() * sampleService.years) * 20 / 100);
        };
        $scope.AzureStorageGrowth = function () {
            var cost = 0;
            if (sampleService.tcoType == "sql") {
                cost = TotalAzureStorage(sampleService.SqlSizingPricingData, sampleService.sqlType) + config.config[0].AzureCostCalulation.AzureStorage.NonSQLStorageCost * 12 * $scope.NumberOfYears;
            }
            else {
                cost = config.config[0].AzureCostCalulation.AzureStorage.StorageCost * 12 * $scope.NumberOfYears;
            }
            if (sampleService.CurrentYear == 0)
                return cost;
            else {
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total;
            }

        };
        $scope.AzurePostgreStorageGrowth = function () {
            var cost = TotalAzurePostgreStorage(config.config[0].AzureCostCalulation.AzurePostgreStorage, $scope.NumberOfYears) + config.config[0].AzureCostCalulation.AzureStorage.NonSQLStorageCost * 12 * $scope.NumberOfYears;
            if (sampleService.CurrentYear == 0)
                return cost;
            else {
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total;
            }

        };
        $scope.TotalPhysicalServers = function (type) {
            var total = 0;
            angular.forEach(sampleService.ServerAssumptions, function (value, key) {
                if (value.Environment == type) {
                    total += 1;
                }
            });
            return total;
        };
        $scope.ShowWorkload = function () {
            $scope.ServerModelList = sampleService.ServerModelList;
        };
        $scope.ItLabourGrouth = function () {
            //var cost = ($scope.TotalPhysicalServers('') * 1000 * 2 / $scope.ItlabourCosts.TotalPhysicalServerManagedByAdmin) * $scope.ItlabourCosts.HourlyRate * $scope.NumberOfYears;
            var C1 = 0;
            var cost = 0;

            var X1 = ($scope.TotalPhysicalServers('physicalserver') * (2000 / $scope.ItlabourCosts.TotalPhysicalServerManagedByAdmin));
            var X2 = ($scope.TotalPhysicalServers('virtualmachine') * (2000 / $scope.ItlabourCosts.TotalVmsManagedByAdmin));
            C1 = X1 + X2;
            cost = C1 * $scope.ItlabourCosts.HourlyRate;
            if (sampleService.CurrentYear == 0)
                return cost;
            else {
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total;
            }
        };
        $scope.NetworkingBandwidth = function () {
            var NumOfVMs = $scope.TotalPhysicalServers('physicalserver') + $scope.TotalPhysicalServers('virtualmachine');
            var Bandwidth = 0;
            if (NumOfVMs < 50) {
                Bandwidth = NumOfVMs * 10;
            }
            else if (NumOfVMs >= 50 && NumOfVMs < 300) {
                Bandwidth = 1024;
            }
            else {
                Bandwidth = ((NumOfVMs - 300) / 200) + 2;
            }
            if (Bandwidth > 10240) {
                Bandwidth = 10240;
            }
            return Bandwidth;
        };
        $scope.NetworkBreakDownCost = function () {
            var viewMoreDetail1 = [];
            if (sampleService.IsUserCostSavedStatus1 == true) {
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if (value.Type === "Bandwidth" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "Azure Advisor" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    //else if (value.Type === "Azure Security Center" && value.Year.search('1') === 0) {
                    //    viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    //}
                    else if (value.Type === "Azure Active Directory" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "Application Gateway" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    //else if (value.Type === "Backup" && value.Year.search('1') === 0) {
                    //    viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    //}
                    else if (value.Type === "Traffic Manager" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "Network Watcher" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "Loadbalancer" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "Express Route" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "Virtual Network" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "IP Addresses" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    //else if (value.Type === "VPN Gateway" && value.Year.search('1') === 0) {
                    //    viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    //}
                    else if (value.Type === "Log Analytics" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                    else if (value.Type === "Key Vault" && value.Year.search('1') === 0) {
                        viewMoreDetail1.push({ Type: value.Type, Cost: value.Azure });
                    }
                });
            }
            else {
                angular.forEach($scope.AzureCostCalulation.AzureNetworking, function (value, key) {
                    viewMoreDetail1.push({ Type: value.Type, Cost: value.Price * 12 });
                });
            }
            return viewMoreDetail1;
        };
        $scope.AzureSqlCostWithBenifit = function (sqlType, plan) {
            var cost = 0;
            cost = CalculateSqlCostManageInstanceForNew(sampleService.SqlSizingPricingData, sqlType, plan);

            return cost;
        };
        $scope.GetTotalSoftwareCostBasedOnOS = function (SoftwareConfig, OS) {
            var Total = 0;
            for (var i = 0; i < SoftwareConfig.length; i++) {
                if (OS === 'linux') {
                    if (SoftwareConfig[i].CurrentOS !== null) {
                        if (SoftwareConfig[i].CurrentOS.indexOf("Red Hat Enterprise Linux 5") !== -1 || SoftwareConfig[i].CurrentOS.indexOf("CentOS 4/5/6/7") !== -1
                            || SoftwareConfig[i].CurrentOS.indexOf("SUSE Linux Enterprise 11") !== -1) {
                            Total += SoftwareConfig[i].Price;
                        }

                        sampleService.TotalSoftwarecostLinux = Total;
                    }
                }
                else {
                    if (SoftwareConfig[i].CurrentOS !== null) {
                        if (SoftwareConfig[i].CurrentOS.indexOf("Red Hat Enterprise Linux 5") === -1 && SoftwareConfig[i].CurrentOS.indexOf("CentOS 4/5/6/7") === -1
                            && SoftwareConfig[i].CurrentOS.indexOf("SUSE Linux Enterprise 11") === -1) {
                            Total += SoftwareConfig[i].Price;
                        }
                        sampleService.TotalSoftwarecostWindows = Total;
                    }
                }
            }
            return Total;
        };
        $scope.TotalSoftwareLinuxCost = function (SoftwareConfig) {
            var TotalLinuxMachine = 0;
            for (var i = 0; i < SoftwareConfig.length; i++) {
                if (SoftwareConfig[i].CurrentOS !== null) {
                    //if (SoftwareConfig[i].CurrentOS.indexOf("Red Hat Enterprise Linux 5") !== -1 || SoftwareConfig[i].CurrentOS.indexOf("CentOS 4/5/6/7") !== -1
                    //    || SoftwareConfig[i].CurrentOS.indexOf("SUSE Linux Enterprise 11") !== -1 || SoftwareConfig[i].CurrentOS.indexOf("Microsoft® Hyper-V™ Server") !== -1) {
                    //    TotalLinuxMachine += 1;
                    //}
                    if (SoftwareConfig[i].CurrentOS == "linux") {
                        TotalLinuxMachine += 1;
                    }
                }
            }
            if (sampleService.CurrentYear == 0)
                return TotalLinuxMachine * sampleService.softCostAssumption[0].Pricing;
            else {
                var cost = TotalLinuxMachine * sampleService.softCostAssumption[0].Pricing;
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total;
            }
        };
        $scope.TotalSoftwareWindowsCost = function (SoftwareConfig) {
            if (sampleService.CurrentYear == 0)
                return GetTotalSoftwareWindowsCost(SoftwareConfig, sampleService.Assumptions.softwareCost) / sampleService.years;
            else {
                var cost = GetTotalSoftwareWindowsCost(SoftwareConfig, sampleService.Assumptions.softwareCost);
                var C = cost * (Math.pow((1 + (3 / 100)), sampleService.CurrentYear) - 1);
                var Total = (cost + C);
                return Total / sampleService.years;
            }
        };
        sampleService.softwarelinuxcost = $scope.GetTotalSoftwareCostBasedOnOS(config.config[0].SoftwareConfig, 'linux');
        sampleService.softwarewindowscost = $scope.GetTotalSoftwareCostBasedOnOS(config.config[0].SoftwareConfig, 'windows');
        $scope.fnData = function (azureTestPlan, tcoType) {
            azureTestPlan = azureTestPlan === undefined || azureTestPlan === null ? 'threeyearhybrid' : azureTestPlan;
            postgreTestPlan = $scope.planNewPostgre === undefined || $scope.planNewPostgre === null ? 'payasyougo' : $scope.planNewPostgre;
            if (sampleService.tcoType === 'sql') {
                tcoType = 'sql';
            }
            else if (sampleService.tcoType === 'postgre') {
                tcoType = 'postgre';
            }
            else {
                tcoType = (tcoType === undefined || tcoType === null || tcoType === 'all' ? 'all' : tcoType === 'sql' ? 'sql' : 'postgre');
            }
            if (sampleService.IsUserCostSavedStatus1 == true && sampleService.IsAzureCostSavedStatus == true) {
                var data = $scope.TotalCostByCategory = [
                    {
                        onPremises: (GetPriceFromDB(sampleService, "Hardware", "Onpremise") + GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Onpremise") +
                            GetPriceFromDB(sampleService, "Software (Linux)", "Onpremise") + GetPriceFromDB(sampleService, "Software (Windows)", "Onpremise") +
                            GetPriceFromDB(sampleService, "BizTalk", "Onpremise") + GetPriceFromDB(sampleService, "Electricity", "Onpremise") +
                            GetPriceFromDB(sampleService, "Sql License Cost", "Onpremise") + GetPriceFromDB(sampleService, "Sa(SQL)", "Onpremise") +
                            GetPriceFromDB(sampleService, "Sa(Windows License)", "Onpremise") + GetPriceFromDB(sampleService, "Sa(Linux License)", "Onpremise") +
                            GetPriceFromDB(sampleService, "Oracle License", "Onpremise") + GetPriceFromDB(sampleService, "Sa(Oracle)", "Onpremise") +
                            GetPriceFromDB(sampleService, "Virtualization Cost", "Onpremise") + GetPriceFromDB(sampleService, "DR Cost", "Onpremise")),

                        Azure: GetPriceFromDB(sampleService, "Hardware", "Azure") + GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Azure") +
                            GetPriceFromDB(sampleService, "Software (Linux)", "Azure") + GetPriceFromDB(sampleService, "BizTalk", "Azure") +
                            GetPriceFromDB(sampleService, "Sa(Oracle)", "Azure") +
                            GetPriceFromDB(sampleService, "Oracle License", "Azure") + GetPriceFromDB(sampleService, "DR Cost", "Azure") +
                            (tcoType === 'postgre' ? GetPriceFromDB(sampleService, "Sql License Cost", "Azure") : 0),

                        Category: "Compute", SubItems: [
                            { Type: "Hardware", Cost: GetPriceFromDB(sampleService, "Hardware", "Onpremise") },
                            { Type: "Hardware Maintenance Cost", Cost: GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Onpremise") },
                            { Type: "Software (Linux)", Cost: GetPriceFromDB(sampleService, "Software (Linux)", "Onpremise") },
                            { Type: "Software (Windows)", Cost: GetPriceFromDB(sampleService, "Software (Windows)", "Onpremise") },
                            { Type: "Biztalk", Cost: GetPriceFromDB(sampleService, "BizTalk", "Onpremise") },
                            { Type: "Electricity", Cost: GetPriceFromDB(sampleService, "Electricity", "Onpremise") },
                            { Type: "Sql License Cost", Cost: GetPriceFromDB(sampleService, "Sql License Cost", "Onpremise") },
                            { Type: "Sa(SQL)", Cost: GetPriceFromDB(sampleService, "Sa(SQL)", "Onpremise") },
                            { Type: "Sa(Windows License)", Cost: GetPriceFromDB(sampleService, "Sa(Windows License)", "Onpremise") },
                            { Type: "Sa(Linux License)", Cost: GetPriceFromDB(sampleService, "Sa(Linux License)", "Onpremise") },
                            { Type: "Oracle License", Cost: GetPriceFromDB(sampleService, "Oracle License", "Onpremise") },
                            { Type: "Sa(Oracle)", Cost: GetPriceFromDB(sampleService, "Sa(Oracle)", "Onpremise") },
                            { Type: "Virtualization Cost", Cost: GetPriceFromDB(sampleService, "Virtualization Cost", "Onpremise") },
                            { Type: "DR Cost", Cost: GetPriceFromDB(sampleService, "DR Cost", "Onpremise") }
                        ],
                        SubItemsAzure: [
                            { Type: "Azure VM", Cost: GetPriceFromDB(sampleService, "Hardware", "Azure") },
                            { Type: 'Azure SQL', Cost: GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Azure") },
                            { Type: "Azure Linux VM", Cost: GetPriceFromDB(sampleService, "Software (Linux)", "Azure") },
                            { Type: "Biztalk", Cost: GetPriceFromDB(sampleService, "BizTalk", "Azure") },
                            { Type: "PostgreSQL(Oracle)", Cost: GetPriceFromDB(sampleService, "Sql License Cost", "Azure") },
                            { Type: "Oracle License Cost", Cost: GetPriceFromDB(sampleService, "Oracle License", "Azure") },
                            { Type: "Oracle SA(License)", Cost: GetPriceFromDB(sampleService, "Sa(Oracle)", "Azure") },
                            { Type: "Azure DR Cost", Cost: GetPriceFromDB(sampleService, "DR Cost", "Azure") }
                        ]
                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "Data Center", "Onpremise"),
                        Azure: GetPriceFromDB(sampleService, "Data Center", "Azure"),
                        Category: "Data Center"
                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "Bandwidth", "Onpremise") + GetPriceFromDB(sampleService, "Azure Advisor", "Onpremise") + GetPriceFromDB(sampleService, "Azure Security Center", "Onpremise"),
                        Azure: $scope.TotalAzureNetworkingCost(),
                        Category: "Networking",
                        SubItems: [
                            {
                                Type: "Network hardware and software cost", Cost: GetPriceFromDB(sampleService, "Bandwidth", "Onpremise")
                            },
                            {
                                Type: "Network maintenance cost", Cost: GetPriceFromDB(sampleService, "Azure Advisor", "Onpremise")
                            },
                            {
                                Type: "Service provider cost", Cost: GetPriceFromDB(sampleService, "Azure Security Center", "Onpremise")
                            }
                        ],

                        SubItemsAzure: $scope.NetworkBreakDownCost()
                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "Storage hardware cost", "Onpremise") + GetPriceFromDB(sampleService, "Backup and Archive cost", "Onpremise") + GetPriceFromDB(sampleService, "Storage Maintenance cost", "Onpremise"),
                        Azure: GetPriceFromDB(sampleService, "Storage hardware cost", "Azure") + GetPriceFromDB(sampleService, "Backup and Archive cost", "Azure"),
                        Category: "Storage",
                        SubItems: [
                            {
                                Type: "Storage hardware cost", Cost: GetPriceFromDB(sampleService, "Storage hardware cost", "Onpremise")
                            },
                            {
                                Type: "Backup and Archive cost", Cost: GetPriceFromDB(sampleService, "Backup and Archive cost", "Onpremise")
                            },
                            {
                                Type: "Storage Maintenance cost", Cost: GetPriceFromDB(sampleService, "Storage Maintenance cost", "Onpremise")
                            }
                        ],
                        SubItemsAzure: [
                            {
                                Type: "Cost Of Managed Disk", Cost: GetPriceFromDB(sampleService, "Storage hardware cost", "Azure")
                            },
                            {
                                Type: "Azure Backup", Cost: GetPriceFromDB(sampleService, "Backup and Archive cost", "Azure")
                            }
                        ],
                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "IT Labor", "Onpremise"),
                        Azure: GetPriceFromDB(sampleService, "IT Labor", "Azure"),
                        Category: "IT Labor"
                    }
                ];
            }
            else if (sampleService.IsUserCostSavedStatus1 == true && sampleService.IsAzureCostSavedStatus == false) {
                var data = $scope.TotalCostByCategory = [
                    {
                        onPremises: (GetPriceFromDB(sampleService, "Hardware", "Onpremise") + GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Onpremise") +
                            GetPriceFromDB(sampleService, "Software (Linux)", "Onpremise") + GetPriceFromDB(sampleService, "Software (Windows)", "Onpremise") +
                            GetPriceFromDB(sampleService, "BizTalk", "Onpremise") + GetPriceFromDB(sampleService, "Electricity", "Onpremise") +
                            GetPriceFromDB(sampleService, "Sql License Cost", "Onpremise") + GetPriceFromDB(sampleService, "Sa(SQL)", "Onpremise") +
                            GetPriceFromDB(sampleService, "Sa(Windows License)", "Onpremise") + GetPriceFromDB(sampleService, "Sa(Linux License)", "Onpremise") +
                            GetPriceFromDB(sampleService, "Oracle License", "Onpremise") + GetPriceFromDB(sampleService, "Sa(Oracle)", "Onpremise") +
                            GetPriceFromDB(sampleService, "Virtualization Cost", "Onpremise") + GetPriceFromDB(sampleService, "DR Cost", "Onpremise")),

                        Azure: $scope.AzureVmCost(azureTestPlan) + Math.round(($scope.TotalAzureOracleCost()) * 100) / 100 +
                            Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100 + (tcoType == 'all' || tcoType === 'postgre' ? $scope.AzureSqlCost(azureTestPlan) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)) + $scope.AzureLinuxCost(azureTestPlan) + $scope.AzureBiztalkCost(azureTestPlan) + (tcoType === 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) + Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100,
                        Category: "Compute", SubItems: [
                            { Type: "Hardware", Cost: GetPriceFromDB(sampleService, "Hardware", "Onpremise") },
                            { Type: "Hardware Maintenance Cost", Cost: GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Onpremise") },
                            { Type: "Software (Linux)", Cost: GetPriceFromDB(sampleService, "Software (Linux)", "Onpremise") },
                            { Type: "Software (Windows)", Cost: GetPriceFromDB(sampleService, "Software (Windows)", "Onpremise") },
                            { Type: "Biztalk", Cost: GetPriceFromDB(sampleService, "BizTalk", "Onpremise") },
                            { Type: "Electricity", Cost: GetPriceFromDB(sampleService, "Electricity", "Onpremise") },
                            { Type: "Sql License Cost", Cost: GetPriceFromDB(sampleService, "Sql License Cost", "Onpremise") },
                            { Type: "Sa(SQL)", Cost: GetPriceFromDB(sampleService, "Sa(SQL)", "Onpremise") },
                            { Type: "Sa(Windows License)", Cost: GetPriceFromDB(sampleService, "Sa(Windows License)", "Onpremise") },
                            { Type: "Sa(Linux License)", Cost: GetPriceFromDB(sampleService, "Sa(Linux License)", "Onpremise") },
                            { Type: "Oracle License", Cost: GetPriceFromDB(sampleService, "Oracle License", "Onpremise") },
                            { Type: "Sa(Oracle)", Cost: GetPriceFromDB(sampleService, "Sa(Oracle)", "Onpremise") },
                            { Type: "Virtualization Cost", Cost: GetPriceFromDB(sampleService, "Virtualization Cost", "Onpremise") },
                            { Type: "DR Cost", Cost: GetPriceFromDB(sampleService, "DR Cost", "Onpremise") }
                        ],

                        SubItemsAzure: [
                            {
                                Type: "Azure VM", Cost: $scope.AzureVmCost(azureTestPlan)
                            },
                            {
                                Type: tcoType === 'all' || tcoType === 'postgre' ? 'Azure SQL VM' : 'Azure SQL ' + $scope.sqlTypeText, Cost: tcoType === 'all' || tcoType === 'postgre' ? $scope.AzureSqlCost(azureTestPlan) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)
                            },
                            { Type: "Azure Linux VM", Cost: $scope.AzureLinuxCost(azureTestPlan) },
                            { Type: "BizTalk", Cost: $scope.AzureBiztalkCost(azureTestPlan) },
                            { Type: "PostgreSQL(Oracle)", Cost: (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) },
                            { Type: "Oracle License Cost", Cost: Math.round(($scope.TotalAzureOracleCost()) * 100) / 100 },
                            { Type: "Oracle SA(License)", Cost: Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100 },
                            { Type: "Azure DR Cost", Cost: Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 }

                        ]

                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "Data Center", "Onpremise"),
                        Azure: 0.00,
                        Category: "Data Center"
                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "Bandwidth", "Onpremise") + GetPriceFromDB(sampleService, "Azure Advisor", "Onpremise") + GetPriceFromDB(sampleService, "Azure Security Center", "Onpremise"),
                        Azure: $scope.TotalAzureNetworkingCost(),
                        Category: "Networking",
                        SubItems: [
                            {
                                Type: "Network hardware and software cost", Cost: GetPriceFromDB(sampleService, "Bandwidth", "Onpremise")
                            },
                            {
                                Type: "Network maintenance cost", Cost: GetPriceFromDB(sampleService, "Azure Advisor", "Onpremise")
                            },
                            {
                                Type: "Service provider cost", Cost: GetPriceFromDB(sampleService, "Azure Security Center", "Onpremise")
                            }
                        ],

                        SubItemsAzure: $scope.NetworkBreakDownCost()
                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "Storage hardware cost", "Onpremise") + GetPriceFromDB(sampleService, "Backup and Archive cost", "Onpremise") + GetPriceFromDB(sampleService, "Storage Maintenance cost", "Onpremise"),
                        Azure: (tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()) + $scope.GetReconLiftandShiftBackupStorage(),
                        Category: "Storage",
                        SubItems: [
                            {
                                Type: "Storage hardware cost", Cost: GetPriceFromDB(sampleService, "Storage hardware cost", "Onpremise")
                            },
                            {
                                Type: "Backup and Archive cost", Cost: GetPriceFromDB(sampleService, "Backup and Archive cost", "Onpremise")
                            },
                            {
                                Type: "Storage Maintenance cost", Cost: GetPriceFromDB(sampleService, "Storage Maintenance cost", "Onpremise")
                            }
                        ],
                        SubItemsAzure: [
                            {
                                Type: "Cost Of Managed Disk", Cost: tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()
                            },
                            {
                                Type: "Azure Backup", Cost: Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100
                            }
                        ],
                    },
                    {
                        onPremises: GetPriceFromDB(sampleService, "IT Labor", "Onpremise"),
                        Azure: Math.round($scope.AzureItLabourCost() * 100) / 100,
                        Category: "IT Labor"
                    }
                ];
            }
            else {
                var data = $scope.TotalCostByCategory = [
                    {
                        onPremises: ($scope.TotalHardwareCost()) + ($scope.TotalHardwareMaintanenceCost()) + ($scope.TotalVirtualizationCost()) + ($scope.TotalDatabaseCost())
                            + ($scope.TotalElectricityCost()) + ($scope.TotalSASqlCost()) + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig))
                            + ($scope.TotalSoftwareLinuxCost(config.config[0].SoftwareConfig)) + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100)
                            + $scope.TotalOracleDatabaseCost() + (($scope.TotalOracleDatabaseCost()) * 22 / 100) + $scope.CalculateOnPremDRCost(),

                        Azure: $scope.AzureVmCost(azureTestPlan) + Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100 + Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 +
                            Math.round(($scope.TotalAzureOracleCost()) * 100) / 100 + (tcoType === 'all' || tcoType === 'postgre' ? $scope.AzureSqlCost(azureTestPlan) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)) + $scope.AzureLinuxCost(azureTestPlan) + $scope.AzureBiztalkCost(azureTestPlan) + (tcoType === 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0),
                        Category: "Compute", SubItems: [
                            { Type: "Hardware", Cost: Math.round(($scope.TotalHardwareCost()) * 100) / 100 },
                            { Type: "Hardware Maintenance Cost", Cost: Math.round(($scope.TotalHardwareMaintanenceCost()) * 100) / 100 },
                            { Type: "Software (Linux)", Cost: Math.round(($scope.TotalSoftwareLinuxCost(config.config[0].SoftwareConfig)) * 100) / 100 },
                            { Type: "Software (Windows)", Cost: Math.round(($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig)) * 100) / 100 },
                            { Type: "Biztalk", Cost: /*Math.round(($scope.TotalBizTalkCost()) * 100) / 100*/ 0 },
                            { Type: "Electricity", Cost: Math.round($scope.TotalElectricityCost() * 100) / 100 },
                            { Type: "Sql License Cost", Cost: Math.round(($scope.TotalDatabaseCost()) * 100) / 100 },
                            { Type: "Sa(SQL)", Cost: Math.round(($scope.TotalSASqlCost()) * 100) / 100 },
                            { Type: "Sa(Windows License)", Cost: Math.round(($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100) * 100) / 100 },
                            { Type: "Sa(Linux License)", Cost: /*Math.round(($scope.GetTotalSoftwareCostBasedOnOS(config.config[0].SoftwareConfig, 'linux') * 3 / 10) * 100) / 100*/ 0 },
                            { Type: "Oracle License", Cost: Math.round(($scope.TotalOracleDatabaseCost()) * 100) / 100 },
                            { Type: "Sa(Oracle)", Cost: Math.round((($scope.TotalOracleDatabaseCost()) * 22 / 100) * 100) / 100 },
                            { Type: "Virtualization Cost", Cost: Math.round(($scope.TotalVirtualizationCost()) * 100) / 100 },
                            { Type: "DR Cost", Cost: Math.round(($scope.CalculateOnPremDRCost()) * 100) / 100 }
                        ],

                        SubItemsAzure: [
                            {
                                Type: "Azure VM", Cost: $scope.AzureVmCost(azureTestPlan)
                            },
                            {
                                Type: tcoType === 'all' || tcoType === 'postgre' ? 'Azure SQL VM' : 'Azure SQL ' + $scope.sqlTypeText, Cost: tcoType === 'all' || tcoType === 'postgre' ? $scope.AzureSqlCost(azureTestPlan) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)
                            },
                            { Type: "Azure Linux VM", Cost: $scope.AzureLinuxCost(azureTestPlan) },
                            { Type: "BizTalk", Cost: $scope.AzureBiztalkCost(azureTestPlan) },
                            { Type: "PostgreSQL(Oracle)", Cost: (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) },
                            { Type: "Oracle License Cost", Cost: Math.round(($scope.TotalAzureOracleCost()) * 100) / 100 },
                            { Type: "Oracle SA(License)", Cost: Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100 },
                            { Type: "Azure DR Cost", Cost: Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 }
                        ]

                    },
                    {
                        onPremises: Math.round($scope.DataCenterCost() * 100) / 100,
                        Azure: 0.00,
                        Category: "Data Center"
                    },
                    {
                        onPremises: Math.round($scope.OnPremiseTotalsNetworkingCost() * 100) / 100,
                        Azure: Math.round($scope.TotalAzureNetworkingCost() * 100) / 100,
                        Category: "Networking",
                        SubItems: [{
                            Type: "Network hardware and software cost", Cost: $scope.TotalNetworkHardwareSoftwarecost()
                        },
                        {
                            Type: "Network maintenance cost", Cost: $scope.TotalNetworkMaintainanceCost()
                        },
                        {
                            Type: "Service provider cost", Cost: ($scope.NetworkingCost[1].Value * $scope.NetworkingBandwidth() * 12 * $scope.NumberOfYears)
                        }],
                        SubItemsAzure: $scope.NetworkBreakDownCost()
                    },
                    {
                        onPremises: (Math.round(($scope.StorageHardWareCost()) * 100) / 100) +
                            (Math.round(($scope.BackupAndArchiveCost()) * 100) / 100) + (Math.round(($scope.StorageMaintenanceCost()) * 100) / 100),
                        Azure: (tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()) + /*$scope.PageBlobStorageCost()*/Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100,
                        Category: "Storage",
                        SubItems: [
                            {
                                Type: "Storage hardware cost", Cost: Math.round(($scope.StorageHardWareCost()) * 100) / 100
                            },
                            {
                                Type: "Backup and Archive cost", Cost: Math.round(($scope.BackupAndArchiveCost()) * 100) / 100
                            },
                            {
                                Type: "Storage Maintenance cost", Cost: Math.round(($scope.StorageMaintenanceCost()) * 100) / 100
                            }
                        ],
                        SubItemsAzure: [
                            {
                                Type: "Cost Of Managed Disk", Cost: tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() : Math.round($scope.AzureStorageGrowth() * 100) / 100
                            },
                            {
                                Type: "Azure Backup", Cost: Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100
                            }
                        ],
                    },
                    {
                        onPremises: Math.round($scope.ItLabourGrouth() * 100) / 100,
                        Azure: Math.round($scope.AzureItLabourCost() * 100) / 100,
                        Category: "IT Labor"
                    }
                ];
            }
            return data;
        }
        sampleService.TotalCostByCategory = $scope.fnData(sampleService.plan, sampleService.tcoType);
        $scope.Symbol = sampleService.CurrencyTable.Symbol;
        $scope.Rate = sampleService.CurrencyTable.Rate; $scope.RateTemp = sampleService.CurrencyTableTemp;
        $scope.$broadcast('CostingByCategory', {
            CostBreakDown: $scope.fnData(sampleService.plan, sampleService.tcoType),
        });
        $scope.SetGrowthRate = function (year) {
            sampleService.serverGrowth = year.serverGrowth;
            //sampleService.CurrentYear = 5;
            $scope.$broadcast('CostingByCategory', {
                CostBreakDown: $scope.fnData(sampleService.plan, sampleService.tcoType),
            });
        };
        $scope.SetVMper = function (Per) {
            sampleService.VMPer = Per.VMPer;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService)
            $scope.MigrationExcel = sampleService.MigrationExcel[0];
        };
        var finance = new Finance();
        $scope.SetVMThroughputRate = function (Rate) {
            sampleService.VMThroughputRate = Rate.VMThroughputRate;
            sampleService.MigrationExcel = MigrationInputExcel(sampleService);
            $scope.MigrationExcel = sampleService.MigrationExcel[0];
            $scope.CashFlowExcel = CashFlowObject(sampleService, finance);
            sampleService.CashFlowExcel = $scope.CashFlowExcel;

            createGraph(sampleService);
        };
        $scope.SetCostofCapitalPer = function (CapitalPer) {
            sampleService.CostofCapitalPer = CapitalPer.CostofCapitalPer;
        };
        $scope.SetBenefitsRealizedRate0 = function (RealizedRate) {
            sampleService.BenefitsRealizedRate0 = RealizedRate.BenefitsRealizedRate0;
        };
        $scope.SetBenefitsRealizedRate1 = function (RealizedRate) {
            sampleService.BenefitsRealizedRate1 = RealizedRate.BenefitsRealizedRate1;
        };
        $scope.SetBenefitsRealizedRate2 = function (RealizedRate) {
            sampleService.BenefitsRealizedRate2 = RealizedRate.BenefitsRealizedRate2;
        };
        $scope.SetBenefitsRealizedRate3 = function (RealizedRate) {
            sampleService.BenefitsRealizedRate3 = RealizedRate.BenefitsRealizedRate3;
        };
        $scope.SetBenefitsRealizedRate4 = function (RealizedRate) {
            sampleService.BenefitsRealizedRate4 = RealizedRate.BenefitsRealizedRate4;
        };
        $scope.SetYears = function (years, plan) {
            if (sampleService.IsUserCostSavedStatus1) {
                sampleService.IsUserCostSavedStatus1 = true; $scope.IsUserCostSavedStatus1 = true;
                sampleService.IsAzureCostSavedStatus = false; $scope.IsAzureCostSavedStatus = false;
                sampleService.MigrationStatus = true; $scope.MigrationStatus = true;
                sampleService.RentingBenefitsStatus = true; $scope.RentingBenefitsStatus = true;
            }
            else {
                sampleService.IsUserCostSavedStatus1 = false; $scope.IsUserCostSavedStatus1 = false;
                sampleService.MigrationStatus = false; $scope.MigrationStatus = false;
                sampleService.RentingBenefitsStatus = false; $scope.RentingBenefitsStatus = false;
            }
            sampleService.years = years.years;

            $scope.$broadcast('CostingByCategory', {
                CostBreakDown: $scope.fnData(plan, sampleService.tcoType),
            });
            createGraph(sampleService);
            $scope.CashFlowExcel = CashFlowObject(sampleService, finance);
            sampleService.CashFlowExcel = $scope.CashFlowExcel;
        };
        $scope.SetBenifit = function (elm) {
            $scope.benifit = elm.benifit;
            sampleService.benifit = $scope.benifit;
            var AzureCostCalulation = GetAzureCostEstimation(sampleService.ReconLiftandShift_InputData, sampleService.AzureNetworkingCost, sampleService.benifit, sampleService.CurrencyTableTemp, sampleService.ReconLiftShift_MLSData, sampleService.Recon_OracleToPostgreData, sampleService.ReconLiftandShiftSqlLicenseCost, sampleService.vw_AzureOracleCost, sampleService.ReconLiftandShift_BackUpStorage);
            sampleService.AzureCostCalulation = AzureCostCalulation;
            $scope.Change();
        };
        $scope.calculateSavingper = function (DifferencePrice, Total) {
            return Math.abs((((DifferencePrice == undefined ? 0.00 : DifferencePrice) * 100) / Total).toFixed(0));
        };
        $scope.calculateSavingperstl = function (DifferencePrice, Total) {

            return { 'width': Math.abs((((DifferencePrice == undefined ? 0.00 : DifferencePrice) * 100) / Total).toFixed(0)) + '%' };
        };
        $scope.convertPositiveToNegetive = function (Amount) {
            return Math.abs((Amount).toFixed(0));
        };
        $scope.calculateAverage = function (Amount) {
            //return Math.abs((Amount).toFixed(2));	
            return (Amount).toFixed(2);
        };
        $scope.MathPow = function (Base, Exponent) {
            return Math.pow(Base, Exponent);
        };
        $scope.MathCeil = function (value) {
            return Math.ceil(value);
        };
        $scope.MathFloor = function (value) {
            return Math.floor(value);
        };
        $scope.MathRound = function (value) {
            return Math.round(value);
        };
        $scope.NPV = function (Value1, Value, Range) {
            var sum = 0.0;
            for (var i = 0; i < Range.length; i++) {
                sum += Range[i] / Math.pow(1 + Value / 100, i);
            }
            return sum + Value1;
        };
        $scope.IRR = function (Range, out) {
            if (Range.length == 5) {
                var val = Math.ceil(finance.IRR(Range[0], Range[1], Range[2], Range[3], Range[4]));
                return val;
            }
            if (Range.length == 4) {
                var val = Math.ceil(finance.IRR(Range[0], Range[1], Range[2], Range[3]));
                return val;
            }
            if (Range.length == 3) {
                var val = Math.ceil(finance.IRR(Range[0], Range[1], Range[2]));
                return val;
            }
            if (Range.length == 2) {
                var val = Math.ceil(finance.IRR(Range[0], Range[1]));
                return val;
            }
            if (Range.length == 1) {
                var val = Math.ceil(finance.IRR(Range[0], 0.50));
                return val;
            }
        };
        $scope.GetPayBackYear = function (Range) {
            var count = 0;
            for (var i = 0; i < Range.length; i++) {
                if (Range[i] <= 0) {
                    count++;
                }
            }
            if (count == 0) {
                count++;;

            }
            return count;
        };
        $scope.GetPayBackYearFarction = function (Range, fraction) {
            return Range[fraction - 1];
        };
        $scope.GetPayBackFraction = function (Val1, Val2, Val3) {
            if (Val3 < 0) {
                return Val2 / Val1;
            } else {
                return Math.abs(Val2 / Val1);
            }
        };

        var planSelected = $scope.plan === undefined || $scope.plan === null ? 'threeyearhybrid' : $scope.plan;
        var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : sampleService.tcoType === 'postgre' ? 'postgre' : 'sql';
        var postgreTestPlan = $scope.planNewPostgre === undefined || $scope.planNewPostgre === null ? 'payasyougo' : $scope.planNewPostgre;
        if (sampleService.IsUserCostSavedStatus1 == true && sampleService.IsAzureCostSavedStatus == true) {
            $scope.RentingBenifits = [
                {
                    Type: "Hardware",
                    year1: { Difference: CalculateSavedBenifits(sampleService, 1, "Hardware", $scope) },
                    year2: { Difference: CalculateSavedBenifits(sampleService, 2, "Hardware", $scope) },
                    year3: { Difference: CalculateSavedBenifits(sampleService, 3, "Hardware", $scope) },
                    year4: { Difference: CalculateSavedBenifits(sampleService, 4, "Hardware", $scope) },
                    year5: { Difference: CalculateSavedBenifits(sampleService, 5, "Hardware", $scope) },
                    Total: CalculateSavedBenifits(sampleService, 1, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 2, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 3, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 4, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 5, "Hardware", $scope)
                },
                {
                    Type: "Software",
                    year1: { Difference: CalculateSavedBenifits(sampleService, 1, "Software", $scope) },
                    year2: { Difference: CalculateSavedBenifits(sampleService, 2, "Software", $scope) },
                    year3: { Difference: CalculateSavedBenifits(sampleService, 3, "Software", $scope) },
                    year4: { Difference: CalculateSavedBenifits(sampleService, 4, "Software", $scope) },
                    year5: { Difference: CalculateSavedBenifits(sampleService, 5, "Software", $scope) },
                    Total: CalculateSavedBenifits(sampleService, 1, "Software", $scope) + CalculateSavedBenifits(sampleService, 2, "Software", $scope) + CalculateSavedBenifits(sampleService, 3, "Software", $scope) + CalculateSavedBenifits(sampleService, 4, "Software", $scope) + CalculateSavedBenifits(sampleService, 5, "Software", $scope)
                },
                {
                    Type: "Storage",
                    year1: { Difference: CalculateSavedBenifits(sampleService, 1, "Storage", $scope) },
                    year2: { Difference: CalculateSavedBenifits(sampleService, 2, "Storage", $scope) },
                    year3: { Difference: CalculateSavedBenifits(sampleService, 3, "Storage", $scope) },
                    year4: { Difference: CalculateSavedBenifits(sampleService, 4, "Storage", $scope) },
                    year5: { Difference: CalculateSavedBenifits(sampleService, 5, "Storage", $scope) },
                    Total: CalculateSavedBenifits(sampleService, 1, "Storage", $scope) + CalculateSavedBenifits(sampleService, 2, "Storage", $scope) + CalculateSavedBenifits(sampleService, 3, "Storage", $scope) + CalculateSavedBenifits(sampleService, 4, "Storage", $scope) + CalculateSavedBenifits(sampleService, 5, "Storage", $scope)
                },
                {
                    Type: "Electricity",
                    year1: { Difference: CalculateSavedBenifits(sampleService, 1, "Electricity", $scope) },
                    year2: { Difference: CalculateSavedBenifits(sampleService, 2, "Electricity", $scope) },
                    year3: { Difference: CalculateSavedBenifits(sampleService, 3, "Electricity", $scope) },
                    year4: { Difference: CalculateSavedBenifits(sampleService, 4, "Electricity", $scope) },
                    year5: { Difference: CalculateSavedBenifits(sampleService, 5, "Electricity", $scope) },
                    Total: CalculateSavedBenifits(sampleService, 1, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 2, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 3, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 4, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 5, "Electricity", $scope)
                },
                {
                    Type: "Networking",
                    year1: { Difference: CalculateSavedBenifits(sampleService, 1, "Networking", $scope) },
                    year2: { Difference: CalculateSavedBenifits(sampleService, 2, "Networking", $scope) },
                    year3: { Difference: CalculateSavedBenifits(sampleService, 3, "Networking", $scope) },
                    year4: { Difference: CalculateSavedBenifits(sampleService, 4, "Networking", $scope) },
                    year5: { Difference: CalculateSavedBenifits(sampleService, 5, "Networking", $scope) },
                    Total: CalculateSavedBenifits(sampleService, 1, "Networking", $scope) + CalculateSavedBenifits(sampleService, 2, "Networking", $scope) + CalculateSavedBenifits(sampleService, 3, "Networking", $scope) + CalculateSavedBenifits(sampleService, 4, "Networking", $scope) + CalculateSavedBenifits(sampleService, 5, "Networking", $scope)
                },
                {
                    Type: "Data Center",
                    year1: { Difference: CalculateSavedBenifits(sampleService, 1, "Data Center", $scope) },
                    year2: { Difference: CalculateSavedBenifits(sampleService, 2, "Data Center", $scope) },
                    year3: { Difference: CalculateSavedBenifits(sampleService, 3, "Data Center", $scope) },
                    year4: { Difference: CalculateSavedBenifits(sampleService, 4, "Data Center", $scope) },
                    year5: { Difference: CalculateSavedBenifits(sampleService, 5, "Data Center", $scope) },
                    Total: CalculateSavedBenifits(sampleService, 1, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 2, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 3, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 4, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 5, "Data Center", $scope)
                },
                {
                    Type: "IT Labor Cost",
                    year1: { Difference: CalculateSavedBenifits(sampleService, 1, "IT Labor", $scope) },
                    year2: { Difference: CalculateSavedBenifits(sampleService, 2, "IT Labor", $scope) },
                    year3: { Difference: CalculateSavedBenifits(sampleService, 3, "IT Labor", $scope) },
                    year4: { Difference: CalculateSavedBenifits(sampleService, 4, "IT Labor", $scope) },
                    year5: { Difference: CalculateSavedBenifits(sampleService, 5, "IT Labor", $scope) },
                    Total: CalculateSavedBenifits(sampleService, 1, "IT Labor", $scope) + CalculateSavedBenifits(sampleService, 2, "IT Labor", $scope) + CalculateSavedBenifits(sampleService, 3, "IT Labor", $scope) + CalculateSavedBenifits(sampleService, 4, "IT Labor", $scope) + CalculateSavedBenifits(sampleService, 5, "IT Labor", $scope)
                },
                {
                    Type: "Total Benefit",
                    year1: { Total: CalculateSavedBenifits(sampleService, 1, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 1, "Software", $scope) + CalculateSavedBenifits(sampleService, 1, "Storage", $scope) + CalculateSavedBenifits(sampleService, 1, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 1, "Networking", $scope) + CalculateSavedBenifits(sampleService, 1, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 1, "IT Labor", $scope) },
                    year2: { Total: CalculateSavedBenifits(sampleService, 2, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 2, "Software", $scope) + CalculateSavedBenifits(sampleService, 2, "Storage", $scope) + CalculateSavedBenifits(sampleService, 2, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 2, "Networking", $scope) + CalculateSavedBenifits(sampleService, 2, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 2, "IT Labor", $scope) },
                    year3: { Total: CalculateSavedBenifits(sampleService, 3, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 3, "Software", $scope) + CalculateSavedBenifits(sampleService, 3, "Storage", $scope) + CalculateSavedBenifits(sampleService, 3, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 3, "Networking", $scope) + CalculateSavedBenifits(sampleService, 3, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 3, "IT Labor", $scope) },
                    year4: { Total: CalculateSavedBenifits(sampleService, 4, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 4, "Software", $scope) + CalculateSavedBenifits(sampleService, 4, "Storage", $scope) + CalculateSavedBenifits(sampleService, 4, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 4, "Networking", $scope) + CalculateSavedBenifits(sampleService, 4, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 4, "IT Labor", $scope) },
                    year5: { Total: CalculateSavedBenifits(sampleService, 5, "Hardware", $scope) + CalculateSavedBenifits(sampleService, 5, "Software", $scope) + CalculateSavedBenifits(sampleService, 5, "Storage", $scope) + CalculateSavedBenifits(sampleService, 5, "Electricity", $scope) + CalculateSavedBenifits(sampleService, 5, "Networking", $scope) + CalculateSavedBenifits(sampleService, 5, "Data Center", $scope) + CalculateSavedBenifits(sampleService, 5, "IT Labor", $scope) }
                }
            ];
        }
        else if (sampleService.IsUserCostSavedStatus1 == true && sampleService.IsAzureCostSavedStatus == false) {
            $scope.RentingBenifits = [
                {
                    Type: "Hardware",
                    year1: { Difference: CalculateSavedBenifitsAzure(sampleService, 1, "Hardware", $scope) },
                    year2: { Difference: CalculateSavedBenifitsAzure(sampleService, 2, "Hardware", $scope) },
                    year3: { Difference: CalculateSavedBenifitsAzure(sampleService, 3, "Hardware", $scope) },
                    year4: { Difference: CalculateSavedBenifitsAzure(sampleService, 4, "Hardware", $scope) },
                    year5: { Difference: CalculateSavedBenifitsAzure(sampleService, 5, "Hardware", $scope) },
                    Total: CalculateSavedBenifitsAzure(sampleService, 1, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Hardware", $scope)
                },
                {
                    Type: "Software",
                    year1: { Difference: CalculateSavedBenifitsAzure(sampleService, 1, "Software", $scope) },
                    year2: { Difference: CalculateSavedBenifitsAzure(sampleService, 2, "Software", $scope) },
                    year3: { Difference: CalculateSavedBenifitsAzure(sampleService, 3, "Software", $scope) },
                    year4: { Difference: CalculateSavedBenifitsAzure(sampleService, 4, "Software", $scope) },
                    year5: { Difference: CalculateSavedBenifitsAzure(sampleService, 5, "Software", $scope) },
                    Total: CalculateSavedBenifitsAzure(sampleService, 1, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Software", $scope)
                },
                {
                    Type: "Storage",
                    year1: { Difference: CalculateSavedBenifitsAzure(sampleService, 1, "Storage", $scope) },
                    year2: { Difference: CalculateSavedBenifitsAzure(sampleService, 2, "Storage", $scope) },
                    year3: { Difference: CalculateSavedBenifitsAzure(sampleService, 3, "Storage", $scope) },
                    year4: { Difference: CalculateSavedBenifitsAzure(sampleService, 4, "Storage", $scope) },
                    year5: { Difference: CalculateSavedBenifitsAzure(sampleService, 5, "Storage", $scope) },
                    Total: CalculateSavedBenifitsAzure(sampleService, 1, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Storage", $scope)
                },
                {
                    Type: "Electricity",
                    year1: { Difference: CalculateSavedBenifitsAzure(sampleService, 1, "Electricity", $scope) },
                    year2: { Difference: CalculateSavedBenifitsAzure(sampleService, 2, "Electricity", $scope) },
                    year3: { Difference: CalculateSavedBenifitsAzure(sampleService, 3, "Electricity", $scope) },
                    year4: { Difference: CalculateSavedBenifitsAzure(sampleService, 4, "Electricity", $scope) },
                    year5: { Difference: CalculateSavedBenifitsAzure(sampleService, 5, "Electricity", $scope) },
                    Total: CalculateSavedBenifitsAzure(sampleService, 1, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Electricity", $scope)
                },
                {
                    Type: "Networking",
                    year1: { Difference: CalculateSavedBenifitsAzure(sampleService, 1, "Networking", $scope) },
                    year2: { Difference: CalculateSavedBenifitsAzure(sampleService, 2, "Networking", $scope) },
                    year3: { Difference: CalculateSavedBenifitsAzure(sampleService, 3, "Networking", $scope) },
                    year4: { Difference: CalculateSavedBenifitsAzure(sampleService, 4, "Networking", $scope) },
                    year5: { Difference: CalculateSavedBenifitsAzure(sampleService, 5, "Networking", $scope) },
                    Total: CalculateSavedBenifitsAzure(sampleService, 1, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Networking", $scope)
                },
                {
                    Type: "Data Center",
                    year1: { Difference: CalculateSavedBenifitsAzure(sampleService, 1, "Data Center", $scope) },
                    year2: { Difference: CalculateSavedBenifitsAzure(sampleService, 2, "Data Center", $scope) },
                    year3: { Difference: CalculateSavedBenifitsAzure(sampleService, 3, "Data Center", $scope) },
                    year4: { Difference: CalculateSavedBenifitsAzure(sampleService, 4, "Data Center", $scope) },
                    year5: { Difference: CalculateSavedBenifitsAzure(sampleService, 5, "Data Center", $scope) },
                    Total: CalculateSavedBenifitsAzure(sampleService, 1, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Data Center", $scope)
                },
                {
                    Type: "IT Labor Cost",
                    year1: { Difference: CalculateSavedBenifitsAzure(sampleService, 1, "IT Labor", $scope) },
                    year2: { Difference: CalculateSavedBenifitsAzure(sampleService, 2, "IT Labor", $scope) },
                    year3: { Difference: CalculateSavedBenifitsAzure(sampleService, 3, "IT Labor", $scope) },
                    year4: { Difference: CalculateSavedBenifitsAzure(sampleService, 4, "IT Labor", $scope) },
                    year5: { Difference: CalculateSavedBenifitsAzure(sampleService, 5, "IT Labor", $scope) },
                    Total: CalculateSavedBenifitsAzure(sampleService, 1, "IT Labor", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "IT Labor", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "IT Labor", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "IT Labor", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "IT Labor", $scope)
                },
                {
                    Type: "Total Benefit",
                    year1: { Total: CalculateSavedBenifitsAzure(sampleService, 1, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 1, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 1, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 1, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 1, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 1, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 1, "IT Labor", $scope) },
                    year2: { Total: CalculateSavedBenifitsAzure(sampleService, 2, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 2, "IT Labor", $scope) },
                    year3: { Total: CalculateSavedBenifitsAzure(sampleService, 3, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 3, "IT Labor", $scope) },
                    year4: { Total: CalculateSavedBenifitsAzure(sampleService, 4, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 4, "IT Labor", $scope) },
                    year5: { Total: CalculateSavedBenifitsAzure(sampleService, 5, "Hardware", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Software", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Storage", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Electricity", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Networking", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "Data Center", $scope) + CalculateSavedBenifitsAzure(sampleService, 5, "IT Labor", $scope) }
                }
            ];
        }
        else {
            var HardwareYear1 = (($scope.TotalHardwareCost() + $scope.TotalHardwareMaintanenceCost()) - 0.00);
            var HardwareYear2 = CalculateIntrest(($scope.TotalHardwareCost() + $scope.TotalHardwareMaintanenceCost()), sampleService.serverGrowth, 1) - CalculateIntrest(0.00, sampleService.serverGrowth, 1);
            var HardwareYear3 = CalculateIntrest(($scope.TotalHardwareCost() + $scope.TotalHardwareMaintanenceCost()), sampleService.serverGrowth, 2) - CalculateIntrest(0.00, sampleService.serverGrowth, 2);
            var HardwareYear4 = CalculateIntrest(($scope.TotalHardwareCost() + $scope.TotalHardwareMaintanenceCost()), sampleService.serverGrowth, 3) - CalculateIntrest(0.00, sampleService.serverGrowth, 3);
            var HardwareYear5 = CalculateIntrest(($scope.TotalHardwareCost() + $scope.TotalHardwareMaintanenceCost()), sampleService.serverGrowth, 4) - CalculateIntrest(0.00, sampleService.serverGrowth, 4);
            var SoftwareYear1 = ($scope.TotalDatabaseCost() + $scope.TotalOracleDatabaseCost() + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100) + $scope.TotalSoftwareCost()) - (($scope.AzureBiztalkCost(planSelected) + $scope.AzureVmCost(planSelected) + Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100 + Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 +
                Math.round(($scope.TotalAzureOracleCost()) * 100) / 100 + (tcoType == 'all' || tcoType == 'postgre' ? $scope.AzureSqlCost(planSelected) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)) + $scope.AzureLinuxCost(planSelected) + (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0)));
            var SoftwareYear2 = (($scope.TotalDatabaseCost() + $scope.TotalOracleDatabaseCost() + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100)) + CalculateIntrest(($scope.TotalSoftwareCost()), sampleService.serverGrowth, 1)) - ((Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100) + (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100) + CalculateIntrest((($scope.AzureBiztalkCost(planSelected) + Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 +
                $scope.AzureVmCost(planSelected) + (tcoType == 'all' || tcoType == 'postgre' ? $scope.AzureSqlCost(planSelected) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)) + $scope.AzureLinuxCost(planSelected) + (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0))), sampleService.serverGrowth, 1));
            var SoftwareYear3 = (($scope.TotalDatabaseCost() + $scope.TotalOracleDatabaseCost() + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100)) + CalculateIntrest(($scope.TotalSoftwareCost()), sampleService.serverGrowth, 2)) - ((Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100) + (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100) + CalculateIntrest((($scope.AzureBiztalkCost(planSelected) + Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 +
                $scope.AzureVmCost(planSelected) + (tcoType == 'all' || tcoType == 'postgre' ? $scope.AzureSqlCost(planSelected) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)) + $scope.AzureLinuxCost(planSelected) + (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0))), sampleService.serverGrowth, 2));
            var SoftwareYear4 = (($scope.TotalDatabaseCost() + $scope.TotalOracleDatabaseCost() + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100)) + CalculateIntrest(($scope.TotalSoftwareCost()), sampleService.serverGrowth, 3)) - ((Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100) + (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100) + CalculateIntrest((($scope.AzureBiztalkCost(planSelected) + Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 +
                $scope.AzureVmCost(planSelected) + (tcoType == 'all' || tcoType == 'postgre' ? $scope.AzureSqlCost(planSelected) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)) + $scope.AzureLinuxCost(planSelected) + (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0))), sampleService.serverGrowth, 3));
            var SoftwareYear5 = (($scope.TotalDatabaseCost() + $scope.TotalOracleDatabaseCost() + ($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100)) + CalculateIntrest(($scope.TotalSoftwareCost()), sampleService.serverGrowth, 4)) - ((Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100) + (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100) + CalculateIntrest((($scope.AzureBiztalkCost(planSelected) + Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 +
                $scope.AzureVmCost(planSelected) + (tcoType == 'all' || tcoType == 'postgre' ? $scope.AzureSqlCost(planSelected) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)) + $scope.AzureLinuxCost(planSelected) + (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0))), sampleService.serverGrowth, 4));
            var StorageYear1 = ((Math.round(($scope.StorageHardWareCost()) * 100) / 100 + Math.round(($scope.BackupAndArchiveCost()) * 100) / 100 + Math.round(($scope.StorageMaintenanceCost()) * 100) / 100) - (tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100 : Math.round($scope.AzureStorageGrowth() * 100) / 100 + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100));
            var StorageYear2 = CalculateIntrest((Math.round(($scope.StorageHardWareCost()) * 100) / 100 + Math.round(($scope.BackupAndArchiveCost()) * 100) / 100 + Math.round(($scope.StorageMaintenanceCost()) * 100) / 100), sampleService.serverGrowth, 1) - CalculateIntrest((tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100 : Math.round($scope.AzureStorageGrowth() * 100) / 100 + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100), sampleService.serverGrowth, 1);
            var StorageYear3 = CalculateIntrest((Math.round(($scope.StorageHardWareCost()) * 100) / 100 + Math.round(($scope.BackupAndArchiveCost()) * 100) / 100 + Math.round(($scope.StorageMaintenanceCost()) * 100) / 100), sampleService.serverGrowth, 2) - CalculateIntrest((tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100 : Math.round($scope.AzureStorageGrowth() * 100) / 100 + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100), sampleService.serverGrowth, 2);
            var StorageYear4 = CalculateIntrest((Math.round(($scope.StorageHardWareCost()) * 100) / 100 + Math.round(($scope.BackupAndArchiveCost()) * 100) / 100 + Math.round(($scope.StorageMaintenanceCost()) * 100) / 100), sampleService.serverGrowth, 3) - CalculateIntrest((tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100 : Math.round($scope.AzureStorageGrowth() * 100) / 100 + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100), sampleService.serverGrowth, 3);
            var StorageYear5 = CalculateIntrest((Math.round(($scope.StorageHardWareCost()) * 100) / 100 + Math.round(($scope.BackupAndArchiveCost()) * 100) / 100 + Math.round(($scope.StorageMaintenanceCost()) * 100) / 100), sampleService.serverGrowth, 4) - CalculateIntrest((tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100 : Math.round($scope.AzureStorageGrowth() * 100) / 100 + Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100), sampleService.serverGrowth, 4);
            var ElectricityYear1 = ((Math.round($scope.TotalElectricityCost() * 100) / 100) - 0.00);
            var ElectricityYear2 = (CalculateIntrest((Math.round($scope.TotalElectricityCost() * 100) / 100), sampleService.serverGrowth, 1) - CalculateIntrest(0.00, sampleService.serverGrowth, 1));
            var ElectricityYear3 = (CalculateIntrest((Math.round($scope.TotalElectricityCost() * 100) / 100), sampleService.serverGrowth, 2) - CalculateIntrest(0.00, sampleService.serverGrowth, 2));
            var ElectricityYear4 = (CalculateIntrest((Math.round($scope.TotalElectricityCost() * 100) / 100), sampleService.serverGrowth, 3) - CalculateIntrest(0.00, sampleService.serverGrowth, 3));
            var ElectricityYear5 = (CalculateIntrest((Math.round($scope.TotalElectricityCost() * 100) / 100), sampleService.serverGrowth, 4) - CalculateIntrest(0.00, sampleService.serverGrowth, 4));
            var NetworkingYear1 = (Math.round($scope.OnPremiseTotalsNetworkingCost() * 100) / 100 - Math.round($scope.TotalAzureNetworkingCost() * 100) / 100);
            var NetworkingYear2 = (CalculateIntrest($scope.OnPremiseTotalsNetworkingCost(), sampleService.serverGrowth, 1) - CalculateIntrest($scope.TotalAzureNetworkingCost(), sampleService.serverGrowth, 1));
            var NetworkingYear3 = (CalculateIntrest($scope.OnPremiseTotalsNetworkingCost(), sampleService.serverGrowth, 2) - CalculateIntrest($scope.TotalAzureNetworkingCost(), sampleService.serverGrowth, 2));
            var NetworkingYear4 = (CalculateIntrest($scope.OnPremiseTotalsNetworkingCost(), sampleService.serverGrowth, 3) - CalculateIntrest($scope.TotalAzureNetworkingCost(), sampleService.serverGrowth, 3));
            var NetworkingYear5 = (CalculateIntrest($scope.OnPremiseTotalsNetworkingCost(), sampleService.serverGrowth, 4) - CalculateIntrest($scope.TotalAzureNetworkingCost(), sampleService.serverGrowth, 4));
            var DataCenterYear1 = (Math.round($scope.DataCenterCost() * 100) / 100 - 0.00);
            var DataCenterYear2 = (CalculateIntrest((Math.round($scope.DataCenterCost() * 100) / 100), sampleService.serverGrowth, 1) - CalculateIntrest(0.00, sampleService.serverGrowth, 1));
            var DataCenterYear3 = (CalculateIntrest((Math.round($scope.DataCenterCost() * 100) / 100), sampleService.serverGrowth, 2) - CalculateIntrest(0.00, sampleService.serverGrowth, 2));
            var DataCenterYear4 = (CalculateIntrest((Math.round($scope.DataCenterCost() * 100) / 100), sampleService.serverGrowth, 3) - CalculateIntrest(0.00, sampleService.serverGrowth, 3));
            var DataCenterYear5 = (CalculateIntrest((Math.round($scope.DataCenterCost() * 100) / 100), sampleService.serverGrowth, 4) - CalculateIntrest(0.00, sampleService.serverGrowth, 4));
            var ItLaborYear1 = (Math.round($scope.ItLabourGrouth() * 100) / 100 - Math.round($scope.AzureItLabourCost() * 100) / 100);
            var ItLaborYear2 = (CalculateIntrest((Math.round($scope.ItLabourGrouth() * 100) / 100), sampleService.serverGrowth, 1) - CalculateIntrest(Math.round($scope.AzureItLabourCost() * 100) / 100, sampleService.serverGrowth, 1));
            var ItLaborYear3 = (CalculateIntrest((Math.round($scope.ItLabourGrouth() * 100) / 100), sampleService.serverGrowth, 2) - CalculateIntrest(Math.round($scope.AzureItLabourCost() * 100) / 100, sampleService.serverGrowth, 2));
            var ItLaborYear4 = (CalculateIntrest((Math.round($scope.ItLabourGrouth() * 100) / 100), sampleService.serverGrowth, 3) - CalculateIntrest(Math.round($scope.AzureItLabourCost() * 100) / 100, sampleService.serverGrowth, 3));
            var ItLaborYear5 = (CalculateIntrest((Math.round($scope.ItLabourGrouth() * 100) / 100), sampleService.serverGrowth, 4) - CalculateIntrest(Math.round($scope.AzureItLabourCost() * 100) / 100, sampleService.serverGrowth, 4));

            $scope.RentingBenifits = [
                {
                    Type: "Hardware",
                    year1: { Difference:  HardwareYear1},
                    year2: { Difference:  HardwareYear2},
                    year3: { Difference:  HardwareYear3},
                    year4: { Difference:  HardwareYear4},
                    year5: { Difference:  HardwareYear5},
                    Total: (HardwareYear1 + HardwareYear2 + HardwareYear3 + HardwareYear4 + HardwareYear5)
                },
                {
                    Type: "Software",
                    year1: { Difference:SoftwareYear1 },
                    year2: { Difference:SoftwareYear2 },
                    year3: { Difference:SoftwareYear3 },
                    year4: { Difference:SoftwareYear4 },
                    year5: { Difference:SoftwareYear5 },
                    Total: (SoftwareYear1 + SoftwareYear2 + SoftwareYear3 + SoftwareYear4 + SoftwareYear5)
                },
                {
                    Type: "Storage",
                    year1: { Difference: StorageYear1},
                    year2: { Difference: StorageYear2},
                    year3: { Difference: StorageYear3},
                    year4: { Difference: StorageYear4},
                    year5: { Difference: StorageYear5},
                    Total: (StorageYear1 + StorageYear2 + StorageYear3 + StorageYear4 + StorageYear5)},
                {
                    Type: "Electricity",
                    year1: { Difference: ElectricityYear1 },
                    year2: { Difference: ElectricityYear2 },
                    year3: { Difference: ElectricityYear3 },
                    year4: { Difference: ElectricityYear4 },
                    year5: { Difference: ElectricityYear5 },
                    Total: (ElectricityYear1 + ElectricityYear2 + ElectricityYear3 + ElectricityYear4 + ElectricityYear5)},
                {
                    Type: "Networking",
                    year1: { Difference:  NetworkingYear1},
                    year2: { Difference:  NetworkingYear2},
                    year3: { Difference:  NetworkingYear3},
                    year4: { Difference:  NetworkingYear4},
                    year5: { Difference:  NetworkingYear5},
                    Total: (NetworkingYear1 + NetworkingYear2 + NetworkingYear3 + NetworkingYear4 + NetworkingYear5)},
                {
                    Type: "Data Center",
                    year1: { Difference:  DataCenterYear1},
                    year2: { Difference:  DataCenterYear2},
                    year3: { Difference:  DataCenterYear3},
                    year4: { Difference:  DataCenterYear4},
                    year5: { Difference:  DataCenterYear5},
                    Total: (DataCenterYear1 + DataCenterYear2 + DataCenterYear3 + DataCenterYear4 + DataCenterYear5) },
                {
                    Type: "IT Labor Cost",
                    year1: { Difference: ItLaborYear1 },
                    year2: { Difference: ItLaborYear2 },
                    year3: { Difference: ItLaborYear3 },
                    year4: { Difference: ItLaborYear4 },
                    year5: { Difference: ItLaborYear5 },
                    Total: (ItLaborYear1 + ItLaborYear2 + ItLaborYear3 + ItLaborYear4 + ItLaborYear5)},
                {
                    Type: "Total Benefit",
                    year1: {Total:  HardwareYear1+ SoftwareYear1 +StorageYear1+ElectricityYear1+NetworkingYear1+DataCenterYear1+ItLaborYear1},
                    year2: { Total: HardwareYear2+ SoftwareYear2 +StorageYear2+ElectricityYear2+NetworkingYear2+DataCenterYear2+ItLaborYear2},
                    year3: { Total: HardwareYear3+ SoftwareYear3 +StorageYear3+ElectricityYear3+NetworkingYear3+DataCenterYear3+ItLaborYear3},
                    year4: { Total: HardwareYear4+ SoftwareYear4 +StorageYear4+ElectricityYear4+NetworkingYear4+DataCenterYear4+ItLaborYear4},
                    year5: { Total: HardwareYear5 + SoftwareYear5 + StorageYear5 + ElectricityYear5 + NetworkingYear5 + DataCenterYear5 + ItLaborYear5}
                }
            ];
        }
        sampleService.RentingBenifits = $scope.RentingBenifits;
        $scope.GetCountByEnvironment = function (OS, filter) {
            var total = 0;
            angular.forEach(sampleService.ServerAssumptions, function (value, key) {
                if (value.Environment === filter && value.CurrentOS === OS
                )
                    total += 1;
            }
            );
            return total;
        };
        $scope.SetTabValue = function (type) {
            $scope.TabValue = type;
        };
        $scope.isVisible = false;
        $scope.viewDetail = function (index, category, type) {
            azureTestPlan = $scope.plan === undefined || $scope.plan === null ? 'threeyearhybrid' : $scope.plan;
            postgreTestPlan = $scope.planNewPostgre === undefined || $scope.planNewPostgre === null ? 'payasyougo' : $scope.planNewPostgre;
            if (sampleService.IsUserCostSavedStatus1 == true && sampleService.IsAzureCostSavedStatus == true) {
                if (type == 'onPremises') {
                    $scope.checkrow1 = -1;
                    $scope.checkrow = ($scope.checkrow === index) ? -1 : index;
                    if (category == "Compute") {
                        $scope.viewMoreDetail = [
                            { Type: "Hardware", Cost: GetPriceFromDB(sampleService, "Hardware", "Onpremise") },
                            { Type: "Hardware Maintenance Cost", Cost: GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Onpremise") },
                            { Type: "Software (Linux)", Cost: GetPriceFromDB(sampleService, "Software (Linux)", "Onpremise") },
                            { Type: "Software (Windows)", Cost: GetPriceFromDB(sampleService, "Software (Windows)", "Onpremise") },
                            { Type: "Biztalk", Cost: GetPriceFromDB(sampleService, "BizTalk", "Onpremise") },
                            { Type: "Electricity", Cost: GetPriceFromDB(sampleService, "Electricity", "Onpremise") },
                            { Type: "Sql License Cost", Cost: GetPriceFromDB(sampleService, "Sql License Cost", "Onpremise") },
                            { Type: "Sa(SQL)", Cost: GetPriceFromDB(sampleService, "Sa(SQL)", "Onpremise") },
                            { Type: "Sa(Windows License)", Cost: GetPriceFromDB(sampleService, "Sa(Windows License)", "Onpremise") },
                            { Type: "Sa(Linux License)", Cost: GetPriceFromDB(sampleService, "Sa(Linux License)", "Onpremise") },
                            { Type: "Oracle License", Cost: GetPriceFromDB(sampleService, "Oracle License", "Onpremise") },
                            { Type: "Sa(Oracle)", Cost: GetPriceFromDB(sampleService, "Sa(Oracle)", "Onpremise") },
                            { Type: "Virtualization Cost", Cost: GetPriceFromDB(sampleService, "Virtualization Cost", "Onpremise") },
                            { Type: "DR Cost", Cost: GetPriceFromDB(sampleService, "DR Cost", "Onpremise") }
                        ];
                    }
                    else if (category === "Networking") {

                        $scope.viewMoreDetail = [
                            {
                                Type: "Network hardware and software cost", Cost: GetPriceFromDB(sampleService, "Bandwidth", "Onpremise")
                            },
                            {
                                Type: "Network maintenance cost", Cost: GetPriceFromDB(sampleService, "Azure Advisor", "Onpremise")
                            },
                            {
                                Type: "Service provider cost", Cost: GetPriceFromDB(sampleService, "Azure Security Center", "Onpremise")
                            }
                        ];
                    }
                    else if (category === "Storage") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Storage hardware cost", Cost: GetPriceFromDB(sampleService, "Storage hardware cost", "Onpremise")
                            },
                            {
                                Type: "Backup and Archive cost", Cost: GetPriceFromDB(sampleService, "Backup and Archive cost", "Onpremise")
                            },
                            {
                                Type: "Storage Maintenance cost", Cost: GetPriceFromDB(sampleService, "Storage Maintenance cost", "Onpremise")
                            },
                        ];
                    }
                    else {
                        $scope.viewMoreDetail = [];
                    }
                }
                else {
                    $scope.checkrow = -1;
                    $scope.checkrow1 = ($scope.checkrow1 === index) ? -1 : index;
                    if (category == "Compute") {
                        $scope.viewMoreDetail = [
                            { Type: "Azure VM", Cost: GetPriceFromDB(sampleService, "Hardware", "Azure") },
                            { Type: $scope.tcoType == 'all' || $scope.tcoType == 'postgre' ? 'Azure SQL VM' : 'Azure SQL ' + $scope.sqlTypeText, Cost: GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Azure") },
                            { Type: "Azure Linux VM", Cost: GetPriceFromDB(sampleService, "Software (Linux)", "Azure") },
                            { Type: "Biztalk", Cost: GetPriceFromDB(sampleService, "BizTalk", "Azure") },
                            { Type: "PostgreSQL(Oracle)", Cost: GetPriceFromDB(sampleService, "Sql License Cost", "Azure") },
                            { Type: "Oracle License Cost", Cost: GetPriceFromDB(sampleService, "Oracle License", "Azure") },
                            { Type: "Oracle SA(License)", Cost: GetPriceFromDB(sampleService, "Sa(Oracle)", "Azure") },
                            { Type: "Azure DR Cost", Cost: GetPriceFromDB(sampleService, "DR Cost", "Azure") }
                        ];
                    }
                    else if (category === "Networking") {
                        $scope.viewMoreDetail = sampleService.viewMoreDetail;

                    }
                    else if (category === "Storage") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Cost Of Managed Disk", Cost: GetPriceFromDB(sampleService, "Storage hardware cost", "Azure")
                            },
                            {
                                Type: "Azure Backup", Cost: GetPriceFromDB(sampleService, "Backup and Archive cost", "Azure")
                            }
                        ];
                    }
                    else {
                        $scope.viewMoreDetail = [];
                    }
                }
            }
            else if (sampleService.IsUserCostSavedStatus1 == true && sampleService.IsAzureCostSavedStatus == false) {
                if (type == 'onPremises') {
                    $scope.checkrow1 = -1;
                    $scope.checkrow = ($scope.checkrow === index) ? -1 : index;
                    if (category == "Compute") {
                        $scope.viewMoreDetail = [
                            { Type: "Hardware", Cost: GetPriceFromDB(sampleService, "Hardware", "Onpremise") },
                            { Type: "Hardware Maintenance Cost", Cost: GetPriceFromDB(sampleService, "Hardware Maintenance Cost", "Onpremise") },
                            { Type: "Software (Linux)", Cost: GetPriceFromDB(sampleService, "Software (Linux)", "Onpremise") },
                            { Type: "Software (Windows)", Cost: GetPriceFromDB(sampleService, "Software (Windows)", "Onpremise") },
                            { Type: "Biztalk", Cost: GetPriceFromDB(sampleService, "BizTalk", "Onpremise") },
                            { Type: "Electricity", Cost: GetPriceFromDB(sampleService, "Electricity", "Onpremise") },
                            { Type: "Sql License Cost", Cost: GetPriceFromDB(sampleService, "Sql License Cost", "Onpremise") },
                            { Type: "Sa(SQL)", Cost: GetPriceFromDB(sampleService, "Sa(SQL)", "Onpremise") },
                            { Type: "Sa(Windows License)", Cost: GetPriceFromDB(sampleService, "Sa(Windows License)", "Onpremise") },
                            { Type: "Sa(Linux License)", Cost: GetPriceFromDB(sampleService, "Sa(Linux License)", "Onpremise") },
                            { Type: "Oracle License", Cost: GetPriceFromDB(sampleService, "Oracle License", "Onpremise") },
                            { Type: "Sa(Oracle)", Cost: GetPriceFromDB(sampleService, "Sa(Oracle)", "Onpremise") },
                            { Type: "Virtualization Cost", Cost: GetPriceFromDB(sampleService, "Virtualization Cost", "Onpremise") },
                            { Type: "DR Cost", Cost: GetPriceFromDB(sampleService, "DR Cost", "Onpremise") }
                        ];
                    }
                    else if (category === "Networking") {

                        $scope.viewMoreDetail = [
                            {
                                Type: "Network hardware and software cost", Cost: GetPriceFromDB(sampleService, "Bandwidth", "Onpremise")
                            },
                            {
                                Type: "Network maintenance cost", Cost: GetPriceFromDB(sampleService, "Azure Advisor", "Onpremise")
                            },
                            {
                                Type: "Service provider cost", Cost: GetPriceFromDB(sampleService, "Azure Security Center", "Onpremise")
                            }
                        ];
                    }
                    else if (category === "Storage") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Storage hardware cost", Cost: GetPriceFromDB(sampleService, "Storage hardware cost", "Onpremise")
                            },
                            {
                                Type: "Backup and Archive cost", Cost: GetPriceFromDB(sampleService, "Backup and Archive cost", "Onpremise")
                            },
                            {
                                Type: "Storage Maintenance cost", Cost: GetPriceFromDB(sampleService, "Storage Maintenance cost", "Onpremise")
                            },
                        ];
                    }
                    else {
                        $scope.viewMoreDetail = [];
                    }
                }
                else {
                    $scope.checkrow = -1;
                    $scope.checkrow1 = ($scope.checkrow1 === index) ? -1 : index;
                    if (category == "Compute") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Azure VM", Cost: $scope.AzureVmCost(azureTestPlan)
                            },
                            {
                                Type: $scope.tcoType == 'all' || $scope.tcoType == 'postgre' ? 'Azure SQL VM' : 'Azure SQL ' + $scope.sqlTypeText, Cost: $scope.tcoType == 'all' || $scope.tcoType === 'postgre' ? $scope.AzureSqlCost(azureTestPlan) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)
                            },
                            { Type: "Azure Linux VM", Cost: $scope.AzureLinuxCost(azureTestPlan) },
                            { Type: "BizTalk", Cost: $scope.AzureBiztalkCost(azureTestPlan) },
                            { Type: "PostgreSQL(Oracle)", Cost: (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) },
                            { Type: "Oracle License Cost", Cost: Math.round(($scope.TotalAzureOracleCost()) * 100) / 100 },
                            { Type: "Oracle SA(License)", Cost: Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100 },
                            { Type: "Azure DR Cost", Cost: Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 }
                        ];
                    }
                    else if (category === "Networking") {
                        $scope.viewMoreDetail = [];
                        angular.forEach($scope.AzureCostCalulation.AzureNetworking, function (value, key) {
                            $scope.viewMoreDetail.push({ Type: value.Type, Cost: value.Price * 12 });
                        });
                    }
                    else if (category === "Storage") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Cost Of Managed Disk", Cost: $scope.tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()
                            },
                            {
                                Type: "Azure Backup", Cost: /*$scope.PageBlobStorageCost()*/Math.round($scope.GetReconLiftandShiftBackupStorage() * 100) / 100
                            }
                        ];
                    }
                    else {
                        $scope.viewMoreDetail = [];
                    }
                }
            }
            else {
                if (type == 'onPremises') {
                    $scope.checkrow1 = -1;
                    $scope.checkrow = ($scope.checkrow === index) ? -1 : index;
                    if (category == "Compute") {
                        $scope.viewMoreDetail = [
                            { Type: "Hardware", Cost: Math.round(($scope.TotalHardwareCost()) * 100) / 100 },
                            { Type: "Hardware Maintenance Cost", Cost: Math.round(($scope.TotalHardwareMaintanenceCost()) * 100) / 100 },
                            { Type: "Software (Linux)", Cost: Math.round(($scope.TotalSoftwareLinuxCost(config.config[0].SoftwareConfig)) * 100) / 100 },
                            { Type: "Software (Windows)", Cost: Math.round(($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig)) * 100) / 100 },
                            { Type: "Biztalk", Cost: /*Math.round(($scope.TotalBizTalkCost()) * 100) / 100*/ 0 },
                            { Type: "Electricity", Cost: Math.round($scope.TotalElectricityCost() * 100) / 100 },
                            { Type: "Sql License Cost", Cost: Math.round(($scope.TotalDatabaseCost()) * 100) / 100 },
                            { Type: "Sa(SQL)", Cost: Math.round(($scope.TotalSASqlCost()) * 100) / 100 },
                            { Type: "Sa(Windows License)", Cost: Math.round(($scope.TotalSoftwareWindowsCost(config.config[0].SoftwareConfig) * sampleService.sa / 100) * 100) / 100 },
                            { Type: "Sa(Linux License)", Cost: /*Math.round(($scope.GetTotalSoftwareCostBasedOnOS(config.config[0].SoftwareConfig, 'linux') * 3 / 10) * 100) / 100*/ 0 },
                            { Type: "Oracle License", Cost: Math.round(($scope.TotalOracleDatabaseCost()) * 100) / 100 },
                            { Type: "Sa(Oracle)", Cost: (Math.round(($scope.TotalOracleDatabaseCost()) * 22 / 100) * 100) / 100 },
                            { Type: "Virtualization Cost", Cost: Math.round(($scope.TotalVirtualizationCost()) * 100) / 100 },
                            { Type: "DR Cost", Cost: Math.round(($scope.CalculateOnPremDRCost()) * 100) / 100 }
                        ];
                    }

                    else if (category === "Networking") {

                        $scope.viewMoreDetail = [
                            {
                                Type: "Network hardware and software cost", Cost: Math.round($scope.TotalNetworkHardwareSoftwarecost() * 100) / 100
                            },
                            {
                                Type: "Network maintenance cost", Cost: Math.round($scope.TotalNetworkMaintainanceCost() * 100) / 100
                            },
                            {
                                Type: "Service provider cost", Cost: Math.round(($scope.NetworkingCost[1].Value * $scope.NetworkingBandwidth() * 12 * $scope.NumberOfYears) * 100) / 100
                            },
                        ];
                    }
                    else if (category === "Storage") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Storage hardware cost", Cost: Math.round(($scope.StorageHardWareCost()) * 100) / 100
                            },
                            {
                                Type: "Backup and Archive cost", Cost: Math.round(($scope.BackupAndArchiveCost()) * 100) / 100
                            },
                            {
                                Type: "Storage Maintenance cost", Cost: Math.round(($scope.StorageMaintenanceCost()) * 100) / 100
                            }
                        ];
                    }
                    else {
                        $scope.viewMoreDetail = [];
                    }
                }
                else {
                    $scope.checkrow = -1;
                    $scope.checkrow1 = ($scope.checkrow1 === index) ? -1 : index;
                    if (category == "Compute") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Azure VM", Cost: $scope.AzureVmCost(azureTestPlan)
                            },
                            {
                                Type: $scope.tcoType === 'all' || $scope.tcoType === 'postgre' ? 'Azure SQL VM' : 'Azure SQL ' + $scope.sqlTypeText, Cost: $scope.tcoType === 'all' || $scope.tcoType === 'postgre' ? $scope.AzureSqlCost(azureTestPlan) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew)
                            },
                            { Type: "Azure Linux VM", Cost: $scope.AzureLinuxCost(azureTestPlan) },
                            { Type: "BizTalk", Cost: $scope.AzureBiztalkCost(azureTestPlan) },
                            //{ Type: "PostgreSQL(Oracle)", Cost: $scope.AzurePostgreSQLCost(postgreTestPlan) },
                            { Type: "PostgreSQL(Oracle)", Cost: (tcoType == 'postgre' ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) },
                            { Type: "Oracle License Cost", Cost: Math.round(($scope.TotalAzureOracleCost()) * 100) / 100 },
                            { Type: "Oracle SA(License)", Cost: Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100 },
                            { Type: "Azure DR Cost", Cost: Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100 }
                        ];
                    }
                    else if (category === "Networking") {
                        $scope.viewMoreDetail = [];
                        angular.forEach($scope.AzureCostCalulation.AzureNetworking, function (value, key) {
                            $scope.viewMoreDetail.push({ Type: value.Type, Cost: value.Price * 12 });
                        });
                    }
                    else if (category === "Storage") {
                        $scope.viewMoreDetail = [
                            {
                                Type: "Cost Of Managed Disk", Cost: $scope.tcoType == 'postgre' ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()
                            },
                            {
                                Type: "Azure Backup", Cost: $scope.GetReconLiftandShiftBackupStorage()
                            }
                        ];
                    }
                    else {
                        $scope.viewMoreDetail = [];
                    }
                }
            }
        };
        $scope.changeTCOType = function (elm, azureTestPlan) {
            if (sampleService.IsUserCostSavedStatus1) {
                sampleService.IsUserCostSavedStatus1 = true; $scope.IsUserCostSavedStatus1 = true;
                sampleService.IsAzureCostSavedStatus = false; $scope.IsAzureCostSavedStatus = false;
                sampleService.MigrationStatus = true; $scope.MigrationStatus = true;
                sampleService.RentingBenefitsStatus = true; $scope.RentingBenefitsStatus = true;
            }
            else {
                sampleService.IsUserCostSavedStatus1 = false; $scope.IsUserCostSavedStatus1 = false;
                sampleService.MigrationStatus = false; $scope.MigrationStatus = false;
                sampleService.RentingBenefitsStatus = false; $scope.RentingBenefitsStatus = false;
            }
            azureTestPlan = azureTestPlan === undefined || azureTestPlan === null ? 'threeyearhybrid' : azureTestPlan;
            $scope.checkrow1 = -1;
            $scope.checkrow = -1;
            $scope.loader = true;
            if (elm.tcoType === 'sql') {
                $scope.tcoType = elm.tcoType;
                sampleService.tcoType = $scope.tcoType;
                $scope.sqlType = 'manageinstance';
                $scope.sqlTypeText = 'MI';
                sampleService.sqlTypeText = $scope.sqlTypeText;
                sampleService.sqlType = $scope.sqlType;
                $scope.plan = azureTestPlan;
                $scope.planNew = azureTestPlan;
                sampleService.plan = $scope.plan;
                sampleService.planNew = $scope.planNew;
                $scope.$broadcast('CostingByCategory', {
                    CostBreakDown: $scope.fnData(sampleService.plan, sampleService.tcoType),
                });
                $scope.loader = false;
            }
            else if (elm.tcoType === 'postgre') {
                $scope.tcoType = elm.tcoType;
                azureTestPlan = 'threeyear';
                $scope.planNewPostgre = azureTestPlan;
                sampleService.tcoType = $scope.tcoType;
                //$scope.sqlType = '';
                sampleService.sqlType = sampleService.tcoType;
                $scope.TotalCostByCategory = $scope.fnData(sampleService.plan, sampleService.tcoType);
                $scope.$broadcast('CostingByCategory', {
                    CostBreakDown: $scope.TotalCostByCategory,
                });
                $scope.loader = false;
            }
            else if (elm.tcoType === 'Sqlpostgre') {

                $scope.tcoType = elm.tcoType;
                sampleService.tcoType = $scope.tcoType;
                sampleService.sqlType = sampleService.tcoType;
                $scope.TotalCostByCategory = $scope.fnData(sampleService.plan, sampleService.tcoType);
                $scope.$broadcast('CostingByCategory', {
                    CostBreakDown: $scope.TotalCostByCategory,
                });
                $scope.loader = false;
            }
            else {
                $scope.tcoType = elm.tcoType;
                sampleService.tcoType = $scope.tcoType;
                $scope.sqlType = '';
                sampleService.sqlType = $scope.sqlType;
                sampleService.sqlType = sampleService.tcoType;
                $scope.TotalCostByCategory = $scope.fnData(sampleService.plan, sampleService.tcoType);
                $scope.$broadcast('CostingByCategory', {
                    CostBreakDown: $scope.TotalCostByCategory,
                });
                $scope.loader = false;
            }
            $scope.SetSqlPlanType = function () {
                if (sampleService.sqlType === 'vcore' || sampleService.sqlType === 'manageinstance' || sampleService.sqlType === 'instancepool' || sampleService.sqlType === 'elasticpool') {
                    return true;
                }
            };
            $scope.Change();
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(10);
        $scope.azurePlan = true;
        $scope.setAzureCostingPlan = function (element) {
            if (sampleService.IsUserCostSavedStatus1) {
                sampleService.IsUserCostSavedStatus1 = true; $scope.IsUserCostSavedStatus1 = true;
                sampleService.IsAzureCostSavedStatus = false; $scope.IsAzureCostSavedStatus = false;
                sampleService.MigrationStatus = true; $scope.MigrationStatus = true;
                sampleService.RentingBenefitsStatus = true; $scope.RentingBenefitsStatus = true;
            }
            else {
                sampleService.IsUserCostSavedStatus1 = false; $scope.IsUserCostSavedStatus1 = false;
                sampleService.MigrationStatus = false; $scope.MigrationStatus = false;
                sampleService.RentingBenefitsStatus = false; $scope.RentingBenefitsStatus = false;
            }
            $scope.checkrow1 = -1;
            $scope.checkrow = -1;
            $scope.plan = element.plan;
            sampleService.plan = $scope.plan;
            if (element.plan.indexOf("hybrid") !== -1) {
                $scope.azurePlan = false;
            }
            else {
                $scope.benifit = "renting";
                $scope.azurePlan = true;
            }
            $scope.Change();
        };
        $scope.ChangeSqlType = function (elm, azureTestPlan) {
            if (sampleService.IsUserCostSavedStatus1) {
                sampleService.IsUserCostSavedStatus1 = true; $scope.IsUserCostSavedStatus1 = true;
                sampleService.IsAzureCostSavedStatus = false; $scope.IsAzureCostSavedStatus = false;
                sampleService.MigrationStatus = true; $scope.MigrationStatus = true;
                sampleService.RentingBenefitsStatus = true; $scope.RentingBenefitsStatus = true;
            }
            else {
                sampleService.IsUserCostSavedStatus1 = false; $scope.IsUserCostSavedStatus1 = false;
                sampleService.MigrationStatus = false; $scope.MigrationStatus = false;
                sampleService.RentingBenefitsStatus = false; $scope.RentingBenefitsStatus = false;
            }
            azureTestPlan = sampleService.plan === undefined || sampleService.plan === null ? 'threeyearhybrid' : sampleService.plan;
            $scope.sqlType = elm.sqlType;
            $scope.sqlTypeText = ($scope.sqlType === 'vcore' ? 'VCore' : $scope.sqlType === 'instancepool' ? 'Instance Pool' : $scope.sqlType === 'elasticpool' ? 'Elastic Pool' : 'MI');
            sampleService.sqlType = $scope.sqlType;
            $scope.SetSqlPlanType = function () {
                if (sampleService.sqlType === 'vcore' || sampleService.sqlType === 'manageinstance' || sampleService.sqlType === 'instancepool' || sampleService.sqlType === 'elasticpool') {
                    //$scope.plan = azureTestPlan;
                    return true;
                }
            };
            $scope.checkrow1 = -1;
            $scope.checkrow = -1;

            $scope.plan = azureTestPlan;
            $scope.Change();
        };
        $scope.ChangePostgrePlanType = function (element) {
            if (sampleService.IsUserCostSavedStatus1) {
                sampleService.IsUserCostSavedStatus1 = true; $scope.IsUserCostSavedStatus1 = true;
                sampleService.IsAzureCostSavedStatus = false; $scope.IsAzureCostSavedStatus = false;
                sampleService.MigrationStatus = true; $scope.MigrationStatus = true;
                sampleService.RentingBenefitsStatus = true; $scope.RentingBenefitsStatus = true;
            }
            else {
                sampleService.IsUserCostSavedStatus1 = false; $scope.IsUserCostSavedStatus1 = false;
                sampleService.MigrationStatus = false; $scope.MigrationStatus = false;
                sampleService.RentingBenefitsStatus = false; $scope.RentingBenefitsStatus = false;
            }
            $scope.checkrow1 = -1;
            $scope.checkrow = -1;
            $scope.planNewPostgre = element.planNewPostgre;
            sampleService.planNewPostgre = $scope.planNewPostgre;
            if (element.planNewPostgre.indexOf("hybrid") !== -1) {
                $scope.azurePlan = false;
            }
            else {
                $scope.benifit = "renting";
                $scope.azurePlan = true;
            }
            $scope.Change();
        };
        $scope.ElementHide = function () {
            if (sampleService.IsUserCostSavedStatus1 === true && $scope.IsFilterReset === false) {
                return true;
            }
            else {
                return false;
            }
        };
        $scope.HideReSetbutton = function () {
            if (sampleService.IsUserCostSavedStatus1 === true && $scope.IsFilterReset === false) {
                return false;
            }
            else {
                return true;
            }
        };
        $scope.HideResetAllDataButton = function () {
            if (sampleService.IsUserCostSavedStatus1 === true) {
                return false;
            }
            else {
                return true;
            }
        };
        $scope.HideSavebutton = function () {
            if (sampleService.IsUserCostSavedStatus1 === true && $scope.IsFilterReset === false) {
                return true;
            }
            else {
                return false;
            }
        };
        $scope.ChangeSqlPlanType = function (elm, azureTestPlan) {
            azureTestPlan = azureTestPlan === undefined || azureTestPlan === null ? 'threeyearhybrid' : azureTestPlan;
            $scope.planNew = elm.planNew;
            sampleService.planNew = $scope.planNew;
            $scope.checkrow1 = -1;
            $scope.checkrow = -1;
            $scope.Change();
        };
        sampleService.MigrationExcel = MigrationInputExcel(sampleService, $scope.consultantCost())
        $scope.MigrationExcel = sampleService.MigrationExcel[0];
        $scope.CashFlowExcel = CashFlowObject(sampleService, finance);
        sampleService.CashFlowExcel = $scope.CashFlowExcel;
        $scope.MigrationStatus2 = sampleService.MigrationStatus;
        var dataMig = MigrationInputExcel(sampleService);
        var MigrationSaveData = [];
        angular.forEach(dataMig, function (value, key) {
            angular.forEach(value, function (value1, key1) {
                MigrationSaveData.push(value1);
            });

        });
        $scope.MigrationSaveData2 = MigrationSaveData;
        createGraph(sampleService);
    });
});
function createGraph(sampleService) {
    $("#chart").kendoChart({
        chartArea: {
            height: 250
        },
        title: {
            text: "Cash Flow Analysis"
        },
        legend: {
            position: "bottom"
        },
        seriesDefaults: {
            type: "column"
        },
        series: [{
            justify: "true",
            type: "area",
            data: getDataCumulative(sampleService.CashFlowExcel, sampleService),
            stack: false,
            name: "Cumulative discounted NCF in M",
            color: "#f4ac41",
            opacity: 1
        }, {
            name: "Discounted Cash-In in M",
            data: getDataDiscountedCashIn(sampleService.CashFlowExcel, sampleService),
            color: "#34afed"
        },
        {
            name: "Discounted Cash Out in M ",
            data: getDataDiscountedCashOut(sampleService.CashFlowExcel, sampleService),
            color: "#ed7434"
        },
        {
            name: "Discounted Net Cash Flows in M ",
            data: getDataDiscountedNetCash(sampleService.CashFlowExcel, sampleService),
            color: "#bfb0a8"
        }],
        valueAxis: {
            majorGridLines: {
                visible: false
            },
            labels: {
                format: "{0}"
            },
            line: {
                visible: true
            },
            axisCrossingValue: 0
        },
        categoryAxis: {
            majorGridLines: {
                visible: false
            },
            categories: getcategory(sampleService),
            line: {
                visible: true
            },
        },
        tooltip: {
            visible: true,
            format: "{0}",
            template: "#= value #"
        }
    });
}
function CalculateSqlCostManageInstanceForNew(SqlSizingPricingData, sqlType, plan) {
    if (sqlType == "dtu") {
        plan = 'threeyearhybrid';
    }
    else {
        plan = plan === undefined || plan === null ? 'threeyearhybrid' : plan;
    }
    var cost = 0;
    angular.forEach(SqlSizingPricingData, function (value, key) {
        if (value.Service_Name.trim().toLocaleLowerCase().indexOf(sqlType) != -1) {
            cost = (value[plan]) * 12;
        }
    });
    return cost;
}
function CalculateSqlCostManageInstance(Recon_SQLManagedInstanceSummary, sqlType) {
    var cost = 0;
    if (sqlType.indexOf('sa') !== -1) {
        var type = sqlType.substr(0, sqlType.indexOf('sa'));
        angular.forEach(Recon_SQLManagedInstanceSummary, function (value, key) {
            if (value.Tier.trim().toLocaleLowerCase() === 'Gen 5'.trim().toLocaleLowerCase() && value.Region.trim().toLocaleLowerCase() === 'East US'.trim().toLocaleLowerCase()) {
                cost += (value.TotalMonthlyHybridPrice + value.DBPrice) * 12;
            }

        });
    }
    else {
        angular.forEach(Recon_SQLManagedInstanceSummary, function (value, key) {
            if (value.Tier.trim().toLocaleLowerCase() === 'Gen 5'.trim().toLocaleLowerCase() && value.Region.trim().toLocaleLowerCase() === 'East US'.trim().toLocaleLowerCase()) {
                cost += (value.TotalMonthlyPrice + value.DBPrice) * 12;
            }
        });
    }
    return cost;
}
function CalculateSqlCostWithoutManageInstance(Recon_SQLSizingSummary, sqlType) {
    var cost = 0;
    if (sqlType.indexOf('sa') !== -1) {
        var type = sqlType.substr(0, sqlType.indexOf('sa'));
        angular.forEach(Recon_SQLSizingSummary, function (value, key) {
            if (value.Type.toLowerCase() == type)
                cost += value.TotalMonthlyHybridPrice;
        });
    }
    else {
        angular.forEach(Recon_SQLSizingSummary, function (value, key) {
            if (value.Type.toLowerCase() == sqlType)
                cost += value.TotalMonthlyPrice;
        });
    }
    return cost * 12;
}
function GetTotalRackRequiredExcel(a) {
    var Total = 0;
    angular.forEach(a, function (value, key) {
        Total += value.RackUnitsRequired * value.TotalServer;
    });
    return Total;
}
function GetUpdatedCost(outputPrice, currentServer, vw_CountVMOnPhysicalServer, virtualizedCost) {

    for (var i = 0; i < vw_CountVMOnPhysicalServer.length; i++) {
        if (currentServer.Name.trim() == vw_CountVMOnPhysicalServer[i].HostComputerName.trim()) {
            outputPrice.Price = virtualizedCost * vw_CountVMOnPhysicalServer[i].CountOfVMs;
            outputPrice.Vms = vw_CountVMOnPhysicalServer[i].CountOfVMs;
            break;
        }
    }
    return outputPrice;
}
function GetPremiseItLaborCost(laborobject) {
    var total = 0;
    angular.forEach(laborobject, function (value, key) {
        if (value.Environment == 'physicalserver')
            total += 1;
    });
    return total;
}
function GetNetwokrkObject(Networkobject, Networkobject1, text, year) {
    var x = [];
    angular.forEach(Networkobject, function (value, key) {
        var item = { label: value.Type, value: value.Price * 12 };
        x.push(item);
    });
    var item = { label: 'Total Azure networking cost over' + text, value: TotalAzureNetworkCost(Networkobject, year) };
    x.push(item);

    return x;
}
function OtherNetworkCost(AzureCostCalulation, NetworkConfig, NumberOfYears) {
    var LogAnalytics = ((AzureCostCalulation.AzureCompute[0].TotalVms + AzureCostCalulation.AzureCompute[1].TotalVms) * 2 - 5) * NetworkConfig.logAnalytics.Cost * NumberOfYears * 12;
    var securityCenterCost = NetworkConfig.securityCenterCost.Cost * NumberOfYears * 12;
    return (LogAnalytics + securityCenterCost);
}
function TotalOnPremisesCost(HardwareConfig, ElectricityConfig, SoftwareConfig, DataCenterConfig, PricePerKiloWatt,
    sampleService, StorageCost, NetworkingCost, ItlabourCosts, NumberOfYears) {
    var Total = (TotalHardwareCostBreakdown(HardwareConfig, NumberOfYears) +
        TotalElectricityCostBreakDown(ElectricityConfig, PricePerKiloWatt, NumberOfYears) + TotalSoftWareCostBreakDown(SoftwareConfig) +
        GetTotalDatabaseCost(sampleService.Assumptions.databaseCost, sampleService.DatabaseAssumptions, NumberOfYears))
        + (TotalDataCenterCost(DataCenterConfig, NumberOfYears)) + (TotalStorageCost(sampleService.StorageAssumptions, StorageCost[0].Cost, NumberOfYears))
        + (TotalNetworkCostBreakdown((TotalHardwareCostBreakdown(HardwareConfig, NumberOfYears) +
            (TotalHardwareCostBreakdown(HardwareConfig, NumberOfYears) * 20 / 100 * NumberOfYears)), TotalSoftWareCostBreakDown(SoftwareConfig),
            NetworkingCost[0].Value, NetworkingCost[2].Value, NetworkingCost[1].Value, 100, NumberOfYears))
        + ((GetTotalServers(DataCenterConfig) * 1000 * 2 / ItlabourCosts.TotalPhysicalServerManagedByAdmin) *
            ItlabourCosts.HourlyRate * NumberOfYears);
    return Total;
}
function TotalAzureVmCost(AzureComputeVms, NumberOfYears, Type) {
    var total = 0;
    angular.forEach(AzureComputeVms, function (value, key) {
        if (value.License == Type) {
            total += value.Price * 12 * NumberOfYears;
        }
    });
    return total;
}
function TotalLiftandShiftPostgreSQLCost(LiftandShiftPostgreSQL, NumberOfYears, Type) {
    var total = 0;
    angular.forEach(LiftandShiftPostgreSQL, function (value, key) {
        if (value.License == Type) {
            total += value.Price * 12 * NumberOfYears;
        }
    });
    return total;
}
function TotalLiftandShiftSQLCost(LiftandShiftSQL, NumberOfYears, Type) {
    var total = 0;
    angular.forEach(LiftandShiftSQL, function (value, key) {
        if (value.License == Type) {
            total += value.Price * 12 * NumberOfYears;
        }
    });
    return total;
}
function TotalAzureBiztalkCost(AzureComputeBiztalk, NumberOfYears, Type) {
    var total = 0;
    angular.forEach(AzureComputeBiztalk, function (value, key) {
        if (value.License == Type) {
            total += value.Price * 12 * NumberOfYears;
        }
    });
    return total;
}
function TotalAzurePostgreSQLCost(AzureComputePostgreSQL, NumberOfYears, Type) {
    var total = 0;
    angular.forEach(AzureComputePostgreSQL, function (value, key) {
        if (value.License == Type) {
            total += value.Price * 12 * NumberOfYears;
        }
    });
    return total;
}
function TotalAzureSqlCost(AzureComputeSql, NumberOfYears, Type) {
    var total = 0;
    angular.forEach(AzureComputeSql, function (value, key) {
        if (value.License == Type) {
            total += value.Price * 12 * NumberOfYears;
        }
    });
    return total;
}
function TotalAzureLinuxCost(AzureComputeLinux, NumberOfYears, Type) {
    var total = 0;
    angular.forEach(AzureComputeLinux, function (value, key) {
        if (value.License == Type) {
            total += value.Price * 12 * NumberOfYears;
        }
    });
    return total;
}
function TotalAzureNetworkCost(AzureNetworking, numberofyears, Rate) {
    var total = 0;
    var PriceAfterRate = 0;
    Rate = Math.round(Rate * 100) / 100;
    angular.forEach(AzureNetworking, function (value, key) {
        if (value.Components == "Production_Management and Governance_Backup") {
            total += 0;
        }
        else {
            PriceAfterRate = parseFloat((value.Price * Rate).toFixed(2));
            total += parseFloat((PriceAfterRate * 12 * numberofyears).toFixed(2));
        }
    });
    return total;
}
function TotalAzureItLabourCost(AzureItLabour, numberofyears, ItLabourCost) {
    return (AzureItLabour.AdminHoursPerYear / ItLabourCost.TotalVmsManagedByAdmin) * numberofyears * AzureItLabour.HourlyRate;
}
function TotalAzureStorage(SqlSizingPricingData, sqlType) {
    var cost = 0;
    angular.forEach(SqlSizingPricingData, function (value, key) {
        if (value.Service_Name.trim().toLocaleLowerCase().indexOf(sqlType) != -1) {
            cost = value.storagecost * 12;
        }
    });
    return cost;
}
function TotalAzurePostgreStorage(AzurePostgreStorage, numberofyears) {
    return AzurePostgreStorage.PostgreStorageCost * 12 * numberofyears;
}
function Workload(sampleService) {
    var load = { Total: {}, ServerModelList: [] };
    var totalHardwareCost = 0;
    var totalSoftwareCost = 0;
    var electricityCost = 0;
    var TotalRackUnitRequired = 0;
    var HAss = sampleService.Assumptions.hardwareCost;
    var VirtualServerCount = 0; var TotalVMS = 0;
    angular.forEach(sampleService.ServerAssumptions, function (value, key) {
        if (value.Environment === "physicalserver") {
            var price = [];
            TotalVMS += value.Vms;
            //if (value.Vms > 0) {
            //    price.push({ Ram: value.Ram });
            //    price[0].Price = sampleService.virtualizedCost * value.Vms;
            //}
            //else {
            //    price = GetHardwareCost(HAss, value.ProcPerServer, value.CorePerProc, value.Ram);
            //    //price = GetHardwareCost(HAss, value.CorePerProc, value.Ram);
            //}
            price = GetHardwareCost(HAss, value.ProcPerServer, value.CorePerProc, value.Ram);
            value.HPrice = price.length > 0 ? price[0].Price : 0;
            totalHardwareCost += value.HPrice;
            price = GetHardwareCost(sampleService.Assumptions.electricityCost, value.ProcPerServer, value.CorePerProc, value.Ram);
            value.EPrice = price.length > 0 ? (price[0].PowerRating / 1000 * sampleService.PricePerKiloWatt) * 732 * 12 * sampleService.NumberOfYears : 0;
            electricityCost += value.EPrice;
            price = GetHardwareCost(sampleService.Assumptions.datacenterCost, value.ProcPerServer, value.CorePerProc, value.Ram);
            value.RackUnitsRequired = price.length > 0 ? price[0].RackUnitsRequired : 0;
            TotalRackUnitRequired += value.RackUnitsRequired;
            value.SPrice = getSoftwareCostBasedOnOS(value.CurrentOS, sampleService.softCostAssumption);
            var BizTalkPrice = 0;
            if (value.BizTalkMachine == 1) {
                var OSType = value.CurrentOS.split(' ');
                BizTalkPrice = getBiztalkCostBasedOnOS(OSType, sampleService.BizTalkAssumption);
            }
            value.BiztalkPrice = BizTalkPrice
            value.SPrice += BizTalkPrice;
            totalSoftwareCost += value.SPrice;
            load.ServerModelList.push(value);
        }
        else {
            VirtualServerCount++;
            value.HPrice = 0.0;
            value.EPrice = 0;
            value.SPrice = getSoftwareCostBasedOnOS(value.CurrentOS, sampleService.softCostAssumption);
            var BizTalkPrice = 0;
            if (value.BizTalkMachine == 1) {
                var OSType = value.CurrentOS.split(' ');
                BizTalkPrice = getBiztalkCostBasedOnOS(OSType, sampleService.BizTalkAssumption);
            }
            value.BiztalkPrice = BizTalkPrice
            value.SPrice += BizTalkPrice;

            totalSoftwareCost += value.SPrice;
            load.ServerModelList.push(value);
        }
    });
    load.Total.THCost = totalHardwareCost;
    load.Total.TSCost = totalSoftwareCost;
    load.Total.TECost = electricityCost;
    load.Total.RackRequired = TotalRackUnitRequired;

    if (VirtualServerCount > TotalVMS) {
        sampleService.VirtualServerCost = sampleService.virtualizedCost * (VirtualServerCount - TotalVMS);
    }
    else {
        sampleService.VirtualServerCost = 0;
    }
    sampleService.VirtualServerWithoutHostCount = VirtualServerCount - TotalVMS;
    return load;
    //sampleService.VirtualServerCost = sampleService.virtualizedCost * VirtualServerCount;
    //sampleService.VirtualServerWithoutHostCount = VirtualServerCount - TotalVMS;
    //return load;
}
function CountTotalPhysicalServers(ServerAssumptions, type) {
    var total = 0;
    angular.forEach(ServerAssumptions, function (value, key) {
        if (value.Environment == type)
            total += 1;
    });
    return total;
}
function SqlVersionCostCalculation(vw_SQLVersionLicenseDetail, dbCost) {
    var myobj = [];
    for (var i = 0; i < vw_SQLVersionLicenseDetail.length; i++) {
        for (var j = 0; j < dbCost.length; j++) {
            if (vw_SQLVersionLicenseDetail[i].License == dbCost[j].LicenseId && (dbCost[j].Sqlversion.indexOf("SQL Server") != -1)) {
                var NoOfCores = vw_SQLVersionLicenseDetail[i].Cores;
                if (NoOfCores <= 4) {
                    var cost = 4 * dbCost[j].Cost;
                    vw_SQLVersionLicenseDetail[i].Cost = cost;
                    myobj.push(vw_SQLVersionLicenseDetail[i]);
                    break;
                }
                else if (NoOfCores > 4 && NoOfCores <= 8) {
                    var cost = 8 * dbCost[j].Cost;
                    vw_SQLVersionLicenseDetail[i].Cost = cost;
                    myobj.push(vw_SQLVersionLicenseDetail[i]);
                    break;
                }
                else if (NoOfCores > 8 && NoOfCores <= 12) {
                    var cost = 12 * dbCost[j].Cost;
                    vw_SQLVersionLicenseDetail[i].Cost = cost;
                    myobj.push(vw_SQLVersionLicenseDetail[i]);
                    break;
                }
                else {
                    var cost = NoOfCores * dbCost[j].Cost;
                    vw_SQLVersionLicenseDetail[i].Cost = cost;
                    myobj.push(vw_SQLVersionLicenseDetail[i]);
                    break;
                }

            }
        }
    }
    return myobj;
}
function SqlVersionCostCalculation_SACostExpiredLicense(vw_SQLVersionLicenseDetail, dbCost) {
    var Total = 0;
    for (var i = 0; i < vw_SQLVersionLicenseDetail.length; i++) {
        for (var j = 0; j < dbCost.length; j++) {
            if (vw_SQLVersionLicenseDetail[i].License == dbCost[j].LicenseId && (dbCost[j].Sqlversion.indexOf("SQL Server") != -1)) {
                if ((vw_SQLVersionLicenseDetail[i].SQL_ServerVersion.indexOf("2008") != -1)) {
                    var NoOfCores = vw_SQLVersionLicenseDetail[i].Cores;
                    if (NoOfCores <= 4) {
                        Total += 4 * dbCost[j].Cost;
                    }
                    else if (NoOfCores > 4 && NoOfCores <= 8) {
                        Total += 8 * dbCost[j].Cost;
                    }
                    else if (NoOfCores > 8 && NoOfCores <= 12) {
                        Total += 12 * dbCost[j].Cost;
                    }
                    else {
                        Total += NoOfCores * dbCost[j].Cost;
                    }
                }
            }
        }
    }
    Total = (Total) * 0.75;
    return Total;
}
function SoftwareAssuranceSQLCostCalculation(vw_SQLVersionLicenseDetail, dbCost, years) {
    var myobj = [];
    for (var i = 0; i < vw_SQLVersionLicenseDetail.length; i++) {
        for (var j = 0; j < dbCost.length; j++) {
            if (vw_SQLVersionLicenseDetail[i].License == dbCost[j].LicenseId && (dbCost[j].Sqlversion.indexOf("Software Assurance") != -1)) {
                var cost = (vw_SQLVersionLicenseDetail[i].Cores) * dbCost[j].Cost * years;
                vw_SQLVersionLicenseDetail[i].SACost = cost;
                myobj.push(vw_SQLVersionLicenseDetail[i]);
            }
        }
    }
    return myobj;
}
//Oracle Lic
function OracleVersionCostCalculation(vw_OracleVersionLicenseDetail, dbCost) {
    var myobj = [];
    if (vw_OracleVersionLicenseDetail !== undefined && vw_OracleVersionLicenseDetail !== null) {
        for (var i = 0; i < vw_OracleVersionLicenseDetail.length; i++) {
            for (var j = 0; j < dbCost.length; j++) {
                //if (vw_OracleVersionLicenseDetail[i].LicenseType == dbCost[j].LicenseId) {
                //    var cost = (vw_OracleVersionLicenseDetail[i].Total_Licensable_Cores) * dbCost[j].Cost;
                //    vw_OracleVersionLicenseDetail[i].Cost = cost;
                //    myobj.push(vw_OracleVersionLicenseDetail[i]);
                //    break;
                //}
                if (vw_OracleVersionLicenseDetail[i].LicenseType == dbCost[j].LicenseId) {
                    var cost = dbCost[j].Cost;
                    vw_OracleVersionLicenseDetail[i].Cost = cost;
                    myobj.push(vw_OracleVersionLicenseDetail[i]);
                    break;
                }
            }
        }
    }
    return myobj;
}
//Azure Cost
function AzureOracleCostCalculation(vw_AzureOracleCost, dbCost) {
    var myobj = [];
    if (vw_AzureOracleCost !== undefined && vw_AzureOracleCost !== null) {
        for (var i = 0; i < vw_AzureOracleCost.length; i++) {
            for (var j = 1; j <= dbCost.length; j++) {
                //var cost = (vw_AzureOracleCost[i].TotalAzureCore) * dbCost[j].Cost;
                var cost = dbCost[j].Cost;
                vw_AzureOracleCost[i].Cost = cost;
                myobj.push(vw_AzureOracleCost[i]) / 5;
                break;
            }
        }
    }
    return myobj;
}
function GetReconLiftandShiftDRCostCalculation(ReconLiftandShift_BackUpStorage, Rate) {
    var myobj = 0;
    Rate = Math.round(Rate * 100) / 100;
    if (ReconLiftandShift_BackUpStorage !== undefined) {
        for (var i = 0; i < ReconLiftandShift_BackUpStorage.length; i++) {
            var cost = ((ReconLiftandShift_BackUpStorage[i].ASR_Cost * Rate) + ReconLiftandShift_BackUpStorage[i].DR_Storage_Cost);
            myobj += cost;
        }
    }
    return myobj * 12;
}
function GetReconLiftandShiftBackupCostCalculation(ReconLiftandShift_BackUpStorage, Rate) {
    var myobj = 0;
    Rate = Math.round(Rate * 100) / 100;
    if (ReconLiftandShift_BackUpStorage !== undefined) {
        for (var i = 0; i < ReconLiftandShift_BackUpStorage.length; i++) {
            var cost = ((ReconLiftandShift_BackUpStorage[i].AzureBackupCost * Rate) + (ReconLiftandShift_BackUpStorage[i].StorageMonthlyCost * Rate));
            myobj += cost;
        }
    }
    return myobj * 12;
}

function GetAzureCostEstimation(AzureCostEstimation, AzureNetworkingCost, benifit, Rate, ReconLiftShift_MLSData, Recon_OracleToPostgreData, ReconLiftShiftSqlLicenseCost, vwAzureOracleCost, ReconLiftandShift_BackUpStorage) {
    var AzureCompute = [];
    var AzureStorage = {};
    var AzureNetworking = {};
    var AzureItLabour = {};
    var AzurePostgreStorage = {};
    var PostgreStorageInGb = 0;
    var PostgreStorageCost = 0;
    var Vms = 0;
    var sql = 0;
    var Linux = 0;
    var storageInGb = 0;
    var StorageCost = 0;
    var NonSQLstorageInGb = 0;
    var NonSQLStorageCost = 0;
    var Biztalk = 0;
    var PostgreSQL = 0;
    //Windows Vms
    var WindowsPayAsYouGoPrice = 0;
    var WindowsPayAsYouGoHybridPrice = 0;
    var WindowsOneYearPrice = 0;
    var WindowsOneYearHybridPrice = 0;
    var WindowsThreeYearPrice = 0;
    var WindowsThreeYearHybrid = 0;
    var WindowsThreeYearMLS = 0;
    var WindowsPayAsYouGoMLS = 0;
    var WindowsOneYearMLS = 0;
    //Sql Vms
    var SqlPayAsYouGoPrice = 0;
    var SqlPayAsYouGoHybridPrice = 0;
    var SqlOneYearPrice = 0;
    var SqlOneYearHybridPrice = 0;
    var SqlThreeYearPrice = 0;
    var SqlThreeYearHybrid = 0;
    var SqlPayAsYouGoMLS = 0;
    var SqlOneYearMLS = 0;
    var SqlThreeYearMLS = 0;
    //Linux Vms
    var LinuxPayAsYouGoPrice = 0;
    var LinuxPayAsYouGoHybridPrice = 0;
    var LinuxOneYearPrice = 0;
    var LinuxOneYearHybridPrice = 0;
    var LinuxThreeYearPrice = 0;
    var LinuxThreeYearHybrid = 0;
    var LinuxPayAsYouGoMLS = 0;
    var LinuxOneYearMLS = 0;
    var LinuxThreeYearMLS = 0;
    //Biztalk Vms
    var BiztalkPayAsYouGoPrice = 0;
    var BiztalkPayAsYouGoHybridPrice = 0;
    var BiztalkOneYearPrice = 0;
    var BiztalkOneYearHybridPrice = 0;
    var BiztalkThreeYearPrice = 0;
    var BiztalkThreeYearHybrid = 0;
    var BiztalkPayAsYouGoMLS = 0;
    var BiztalkOneYearMLS = 0;
    var BiztalkThreeYearMLS = 0;
    //PostgreSQL Price from Sp_GetRecon_OracleToPostgre
    var PostgreSQLPayAsYouGoPrice = 0;
    var PostgreSQLOneYearPrice = 0;
    var PostgreSQLThreeYearPrice = 0;
    var lstOracleComputer = [];
    var lstSQLComputer = [];
    //PostgreSQL Price from Sp_GetReconLiftandShift_InputDataNew
    var LiftandShiftPostgreSQLPayAsYouGoPrice = 0;
    var LiftandShiftPostgreSQLPayAsYouGoHybridPrice = 0;
    var LiftandShiftPostgreSQLOneYearPrice = 0;
    var LiftandShiftPostgreSQLOneYearHybridPrice = 0;
    var LiftandShiftPostgreSQLThreeYearPrice = 0;
    var LiftandShiftPostgreSQLThreeYearHybrid = 0;
    var LiftandShiftPostgreSQLPayAsYouGoMLS = 0;
    var LiftandShiftPostgreSQLOneYearMLS = 0;
    var LiftandShiftPostgreSQLThreeYearMLS = 0;
    var LiftandShiftPostgreSQL = 0;
    //SQL Price from Sp_GetReconLiftandShift_InputDataNew
    var LiftandShiftSQLPayAsYouGoPrice = 0;
    var LiftandShiftSQLPayAsYouGoHybridPrice = 0;
    var LiftandShiftSQLOneYearPrice = 0;
    var LiftandShiftSQLOneYearHybridPrice = 0;
    var LiftandShiftSQLThreeYearPrice = 0;
    var LiftandShiftSQLThreeYearHybrid = 0;
    var LiftandShiftSQLPayAsYouGoMLS = 0;
    var LiftandShiftSQLOneYearMLS = 0;
    var LiftandShiftSQLThreeYearMLS = 0;
    var LiftandShiftSQL = 0;
    var AzureBackupCost = 0;
    var StorageMonthlyCost = 0;
    var ASR_Cost = 0;
    var DR_Storage_Cost = 0;
    Rate = Math.round(Rate * 100) / 100;
    angular.forEach(AzureCostEstimation, function (value, key) {
        if (value.VMType == "Windows") {
            WindowsPayAsYouGoPrice += value.MonthlyPrice_Payasyougo;
            WindowsPayAsYouGoHybridPrice += value.MonthlyPrice_Payasyougo_Hybrid;
            WindowsOneYearPrice += value.MonthlyPrice_One_Year;
            WindowsOneYearHybridPrice += value.MonthlyPrice_One_Year_Hybrid;
            WindowsThreeYearPrice += value.MonthlyPrice_Three_Year;
            WindowsThreeYearHybrid += value.MonthlyPrice_Three_Year_Hybrid;
            Vms += 1;
            NonSQLstorageInGb += value.Storage_GB_;
            NonSQLStorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));
        }
        else if (value.VMType == "SQLServer" && benifit != 'boyl') {
            SqlPayAsYouGoPrice += value.MonthlyPrice_Payasyougo;
            //SqlPayAsYouGoHybridPrice += value.MonthlyPrice_Payasyougo_Hybrid;
            SqlOneYearPrice += value.MonthlyPrice_One_Year;
            //SqlOneYearHybridPrice += value.MonthlyPrice_One_Year_Hybrid;
            SqlThreeYearPrice += value.MonthlyPrice_Three_Year;
            //SqlThreeYearHybrid += value.MonthlyPrice_Three_Year_Hybrid;
            sql += 1;
        }
        else if (value.VMType == "SQLServer" && benifit == 'boyl') {
            var BoylItem = GetBoylItemBasedOnAzureSize(AzureCostEstimation.AzureServiceSize, value);

            if (BoylItem.length > 0) {
                SqlPayAsYouGoPrice += BoylItem.PayAsYouGo_Dollar_ === null ? value.MonthlyPrice_Payasyougo : BoylItem.PayAsYouGo_Dollar_;
                //SqlPayAsYouGoHybridPrice += BoylItem.PayAsYouGo_Dollar_ === null ? value.MonthlyPrice_Payasyougo_Hybrid : BoylItem.PayAsYouGo_Dollar_;
                SqlOneYearPrice += BoylItem.One_Year === null ? value.MonthlyPrice_One_Year : BoylItem.One_Year;
                //SqlOneYearHybridPrice += BoylItem.PayAsYouGo_Dollar_ === null ? value.MonthlyPrice_One_Year_Hybrid : BoylItem.One_Year_Hybrid_;
                SqlThreeYearPrice += BoylItem.PayAsYouGo_Dollar_ === null ? value.MonthlyPrice_Three_Year : BoylItem.Three_Year;
                //SqlThreeYearHybrid += BoylItem.PayAsYouGo_Dollar_ === null ? value.MonthlyPrice_Three_Year_Hybrid : BoylItem.Three_Year_Hybrid_;
                sql += 1;
            }
        }
        else if (value.VMType == "Linux") {
            LinuxPayAsYouGoPrice += value.MonthlyPrice_Payasyougo;

            if (value.CurrentOperatingSystem.toLowerCase().includes("red") || value.CurrentOperatingSystem.toLowerCase().includes("rhel")) {
                LinuxPayAsYouGoHybridPrice += (value.MonthlyPrice_Payasyougo_Hybrid === null ? 0 : value.MonthlyPrice_Payasyougo_Hybrid);
            }
            else {
                LinuxPayAsYouGoHybridPrice += value.MonthlyPrice_Payasyougo;
            }
            LinuxOneYearPrice += value.MonthlyPrice_One_Year;
            LinuxOneYearHybridPrice += value.MonthlyPrice_One_Year;
            LinuxThreeYearPrice += value.MonthlyPrice_Three_Year;
            LinuxThreeYearHybrid += value.MonthlyPrice_Three_Year;
            Linux += 1;
            NonSQLstorageInGb += value.Storage_GB_;
            NonSQLStorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));
        }
        else if (value.VMType == "Biztalk") {
            BiztalkPayAsYouGoPrice += value.MonthlyPrice_Payasyougo;
            BiztalkPayAsYouGoHybridPrice += value.MonthlyPrice_Payasyougo;
            BiztalkOneYearPrice += value.MonthlyPrice_One_Year;
            BiztalkOneYearHybridPrice += value.MonthlyPrice_One_Year;
            BiztalkThreeYearPrice += value.MonthlyPrice_Three_Year;
            BiztalkThreeYearHybrid += value.MonthlyPrice_Three_Year;
            Biztalk += 1;
            NonSQLstorageInGb += value.Storage_GB_;
            NonSQLStorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));
        }
        storageInGb += value.Storage_GB_;
        StorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));

        if (value.WorkLoads !== null && value.WorkLoads.indexOf("ORACLE") !== -1) {
            lstOracleComputer.push(value.ComputerName);
            LiftandShiftPostgreSQLPayAsYouGoPrice += value.MonthlyPrice_Payasyougo;
            LiftandShiftPostgreSQLPayAsYouGoHybridPrice += value.MonthlyPrice_Payasyougo_Hybrid;
            LiftandShiftPostgreSQLOneYearPrice += value.MonthlyPrice_One_Year;
            LiftandShiftPostgreSQLOneYearHybridPrice += value.MonthlyPrice_One_Year_Hybrid;
            LiftandShiftPostgreSQLThreeYearPrice += value.MonthlyPrice_Three_Year;
            LiftandShiftPostgreSQLThreeYearHybrid += value.MonthlyPrice_Three_Year_Hybrid;
            LiftandShiftPostgreSQL += 1;
        }
        if (value.WorkLoads = null && value.WorkLoads.indexOf("SQL") !== -1) {
            lstSQLComputer.push(value.ComputerName);
            LiftandShiftSQLPayAsYouGoPrice += value.MonthlyPrice_Payasyougo;
            LiftandShiftSQLPayAsYouGoHybridPrice += value.MonthlyPrice_Payasyougo_Hybrid;
            LiftandShiftSQLOneYearPrice += value.MonthlyPrice_One_Year;
            LiftandShiftSQLOneYearHybridPrice += value.MonthlyPrice_One_Year_Hybrid;
            LiftandShiftSQLThreeYearPrice += value.MonthlyPrice_Three_Year;
            LiftandShiftSQLThreeYearHybrid += value.MonthlyPrice_Three_Year_Hybrid;
            LiftandShiftSQL += 1;
        }
    });
    angular.forEach(ReconLiftShiftSqlLicenseCost, function (value, key) {
        if (value.SizingType == "sizingonutil") {
            SqlPayAsYouGoHybridPrice += value.MonthlyPrice_Payasyougo_Hybrid;
            SqlOneYearHybridPrice += value.MonthlyPrice_One_Year_Hybrid;
            SqlThreeYearHybrid += value.MonthlyPrice_Three_Year_Hybrid;
        }
    });
    storageInGb = 0;
    StorageCost = 0;
    NonSQLstorageInGb = 0;
    NonSQLStorageCost = 0;
    angular.forEach(ReconLiftShift_MLSData, function (value, key) {
        if (value.VMType == "Windows") {
            if (value.SA_Applied == 0) {
                WindowsPayAsYouGoMLS += value.MonthlyPrice_Payasyougo;
                WindowsOneYearMLS += value.MonthlyPrice_One_Year;
                WindowsThreeYearMLS += value.MonthlyPrice_Three_Year;
            }
            else if (value.SA_Applied == 1) {
                WindowsPayAsYouGoMLS += value.MonthlyPrice_Payasyougo_Hybrid;
                WindowsOneYearMLS += value.MonthlyPrice_One_Year_Hybrid;
                WindowsThreeYearMLS += value.MonthlyPrice_Three_Year_Hybrid;
            }
            NonSQLstorageInGb += value.Storage_GB_;
            NonSQLStorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));
        }
        else if (value.VMType == "SQLServer") {
            if (value.Environment == "Production" && value.SA_Applied == 1) {
                SqlPayAsYouGoMLS += value.MonthlyPrice_Payasyougo_Hybrid;
                SqlOneYearMLS += value.MonthlyPrice_One_Year_Hybrid;
                SqlThreeYearMLS += value.MonthlyPrice_Three_Year_Hybrid;
            }
            else if (value.Environment == "Production" && value.SA_Applied == 0) {
                SqlPayAsYouGoMLS += value.MonthlyPrice_Payasyougo;
                SqlOneYearMLS += value.MonthlyPrice_One_Year;
                SqlThreeYearMLS += value.MonthlyPrice_Three_Year;
            }
            if (value.Environment == "Dev/Test") {
                SqlPayAsYouGoMLS += value.MonthlyPrice_Payasyougo;
                SqlOneYearMLS += value.MonthlyPrice_One_Year;
                SqlThreeYearMLS += value.MonthlyPrice_Three_Year;
            }
        }
        else if (value.VMType == "Linux") {
            LinuxPayAsYouGoMLS += value.MonthlyPrice_Payasyougo;
            LinuxOneYearMLS += value.MonthlyPrice_One_Year;
            LinuxThreeYearMLS += value.MonthlyPrice_Three_Year;
            NonSQLstorageInGb += value.Storage_GB_;
            NonSQLStorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));
        }
        else if (value.VMType == "Biztalk") {
            BiztalkPayAsYouGoMLS += value.MonthlyPrice_Payasyougo;
            BiztalkOneYearMLS += value.MonthlyPrice_One_Year;
            BiztalkThreeYearMLS += value.MonthlyPrice_Three_Year;
            NonSQLstorageInGb += value.Storage_GB_;
            NonSQLStorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));
        }
        storageInGb += value.Storage_GB_;
        StorageCost += parseFloat((value.StoragePrice == null ? 0 : value.StoragePrice).toFixed(2));
    });
    angular.forEach(ReconLiftShift_MLSData, function (value, key) {
        angular.forEach(lstOracleComputer, function (value1, key) {
            if (value.ComputerName == value1) {
                if (value.SA_Applied == 0) {
                    LiftandShiftPostgreSQLPayAsYouGoMLS += value.MonthlyPrice_Payasyougo;
                    LiftandShiftPostgreSQLOneYearMLS += value.MonthlyPrice_One_Year;
                    LiftandShiftPostgreSQLThreeYearMLS += value.MonthlyPrice_Three_Year;
                }
                else if (value.SA_Applied == 1) {
                    LiftandShiftPostgreSQLPayAsYouGoMLS += value.MonthlyPrice_Payasyougo_Hybrid;
                    LiftandShiftPostgreSQLOneYearMLS += value.MonthlyPrice_One_Year_Hybrid;
                    LiftandShiftPostgreSQLThreeYearMLS += value.MonthlyPrice_Three_Year_Hybrid;
                }
            }
        });
        angular.forEach(lstSQLComputer, function (value1, key) {
            if (value.ComputerName == value1) {
                if (value.SA_Applied == 0) {
                    LiftandShiftSQLPayAsYouGoMLS += value.MonthlyPrice_Payasyougo;
                    LiftandShiftSQLOneYearMLS += value.MonthlyPrice_One_Year;
                    LiftandShiftSQLThreeYearMLS += value.MonthlyPrice_Three_Year;
                }
                else if (value.SA_Applied == 1) {
                    LiftandShiftSQLPayAsYouGoMLS += value.MonthlyPrice_Payasyougo_Hybrid;
                    LiftandShiftSQLOneYearMLS += value.MonthlyPrice_One_Year_Hybrid;
                    LiftandShiftSQLThreeYearMLS += value.MonthlyPrice_Three_Year_Hybrid;
                }
            }
        });
    });
    angular.forEach(Recon_OracleToPostgreData, function (value, key) {
        PostgreSQLPayAsYouGoPrice += value.MonthlyPrice_Payasyougo;
        PostgreSQLOneYearPrice += value.MonthlyPrice_One_Year;
        PostgreSQLThreeYearPrice += value.MonthlyPrice_Three_Year;
        PostgreStorageInGb += value.Storage_GB_;
        PostgreStorageCost += value.StoragePrice == null ? 0 : value.StoragePrice;
        PostgreSQL += 1;
    });
    angular.forEach(ReconLiftandShift_BackUpStorage, function (value, key) {
        AzureBackupCost += value.AzureBackupCost == null ? 0 : value.AzureBackupCost;
        StorageMonthlyCost += value.StorageMonthlyCost == null ? 0 : value.StorageMonthlyCost;
        ASR_Cost += value.ASR_Cost == null ? 0 : value.ASR_Cost;
        DR_Storage_Cost += value.DR_Storage_Cost == null ? 0 : value.DR_Storage_Cost;
    });

    var Bandwidth = 0;
    var SecurityCenter = 0;
    var Advisor = 0;
    var ActiveDirectory = 0;
    var KeyVault = 0;
    var ApplicationGateway = 0;
    var Backup = 0;
    var TrafficManager = 0;
    var NetworkWatcher = 0;
    var Loadbalancer = 0;
    var ExpressRoute = 0;
    var VirtualNetwork = 0;
    var IpAddresses = 0;
    var VpnGateway = 0;
    var LogAnalytics = 0;
    angular.forEach(AzureNetworkingCost, function (value, key) {
        if (value.Components == "Production_Security_Security Center")
            SecurityCenter = value.Price;
        if (value.Components == "Production_Management and Governance_Azure Advisor")
            Advisor = value.Price;
        if (value.Components == "Production_Security_Azure Active Directory")
            ActiveDirectory = value.Price;
        if (value.Components == "Production_Security_Key Vault")
            KeyVault = value.Price;
        if (value.Components == "Production_Networking_Application Gateway")
            ApplicationGateway = value.Price;
        if (value.Components == "Production_Management and Governance_Backup")
            Backup = 0;
        //if (value.Components == "Production_Networking_Bandwidth" || value.Components == "Production+Dev/Test_Networking_Bandwidth")
        if (value.Components.indexOf("Bandwidth") !== -1)
            Bandwidth = value.Price;
        if (value.Components == "Production_Networking_Traffic Manager")
            TrafficManager = value.Price;
        if (value.Components == "Production_Networking_Network Watcher")
            NetworkWatcher = value.Price;
        if (value.Components == "Production_Networking_Load Balancer")
            Loadbalancer = value.Price;
        if (value.Components == "Production_Networking_Express Route" || value.Components == "Production+Dev/Test_Networking_Express Route")
            ExpressRoute = value.Price;
        if (value.Components == "Production_Networking_Virtual Network")
            VirtualNetwork = value.Price;
        if (value.Components == "Production_Networking_IP Addresses")
            IpAddresses = value.Price;
        if (value.Components == "Production_Scenario-1_Networking_VPN Gateway")
            VpnGateway = value.Price;
        if (value.Components == "Production_Management and Governance_Log Analytics")
            LogAnalytics = value.Price;
    });
    AzureNetworking = {
        Bandwidth: { Price: parseFloat((Bandwidth * Rate).toFixed(2)), Type: "Bandwidth" },
        Advisor: { Price: parseFloat((Advisor * Rate).toFixed(2)), Type: "Azure Advisor" },
        //SecurityCenter: { Price: parseFloat((SecurityCenter * Rate).toFixed(2)), Type: "Azure Security Center" },
        ActiveDirectory: { Price: parseFloat((ActiveDirectory * Rate).toFixed(2)), Type: "Azure Active Directory" },
        ApplicationGateway: { Price: parseFloat((ApplicationGateway * Rate).toFixed(2)), Type: "Application Gateway" },
        //Backup: { Price: parseFloat((Backup * Rate).toFixed(2)), Type: "Backup" },
        TrafficManager: { Price: parseFloat((TrafficManager * Rate).toFixed(2)), Type: "Traffic Manager" },
        NetworkWatcher: { Price: parseFloat((NetworkWatcher * Rate).toFixed(2)), Type: "Network Watcher" },
        Loadbalancer: { Price: parseFloat((Loadbalancer * Rate).toFixed(2)), Type: "Loadbalancer" },
        ExpressRoute: { Price: parseFloat((ExpressRoute * Rate).toFixed(2)), Type: "Express Route" },
        VirtualNetwork: { Price: parseFloat((VirtualNetwork * Rate).toFixed(2)), Type: "Virtual Network" },
        IpAddresses: { Price: parseFloat((IpAddresses * Rate).toFixed(2)), Type: "IP Addresses" },
        //VpnGateway: { Price: parseFloat((VpnGateway * Rate).toFixed(2)), Type: "VPN Gateway" },
        LogAnalytics: { Price: parseFloat((LogAnalytics * Rate).toFixed(2)), Type: "Log Analytics" },
        KeyVault: { Price: parseFloat((KeyVault * Rate).toFixed(2)), Type: "Key Vault" },
    };
    AzureStorage = { storageInGb: storageInGb, StorageCost: StorageCost, NonSQLstorageInGb: NonSQLstorageInGb, NonSQLStorageCost: NonSQLStorageCost };
    AzureItLabour = { TotalServers: Vms, AdminHoursPerYear: 2000 * Vms, HourlyRate: 50 };
    AzureCompute.push({
        VmType: "Windows", TotalVms: Vms, Items: [
            { License: "payasyougo", Price: WindowsPayAsYouGoPrice },
            { License: "payasyougohybrid", Price: WindowsPayAsYouGoHybridPrice },
            { License: "oneyear", Price: WindowsOneYearPrice },
            { License: "oneyearhybrid", Price: WindowsOneYearHybridPrice },
            { License: "threeyear", Price: WindowsThreeYearPrice },
            { License: "threeyearhybrid", Price: WindowsThreeYearHybrid },
            { License: "payasyougomls", Price: WindowsPayAsYouGoMLS },
            { License: "oneyearmls", Price: WindowsOneYearMLS },
            { License: "threeyearmls", Price: WindowsThreeYearMLS },
        ]
    });
    AzureCompute.push({
        VmType: "Sql", TotalVms: sql, Items: [
            { License: "payasyougo", Price: SqlPayAsYouGoPrice },
            { License: "payasyougohybrid", Price: SqlPayAsYouGoHybridPrice },
            { License: "oneyear", Price: SqlOneYearPrice },
            { License: "oneyearhybrid", Price: SqlOneYearHybridPrice },
            { License: "threeyear", Price: SqlThreeYearPrice },
            { License: "threeyearhybrid", Price: SqlThreeYearHybrid },
            { License: "payasyougomls", Price: SqlPayAsYouGoMLS },
            { License: "oneyearmls", Price: SqlOneYearMLS },
            { License: "threeyearmls", Price: SqlThreeYearMLS },
        ]
    });
    AzureCompute.push({
        VmType: "Linux", TotalVms: Linux, Items: [
            { License: "payasyougo", Price: LinuxPayAsYouGoPrice },
            { License: "payasyougohybrid", Price: LinuxPayAsYouGoHybridPrice },
            { License: "oneyear", Price: LinuxOneYearPrice },
            { License: "oneyearhybrid", Price: LinuxOneYearHybridPrice },
            { License: "threeyear", Price: LinuxThreeYearPrice },
            { License: "threeyearhybrid", Price: LinuxThreeYearHybrid },
            { License: "payasyougomls", Price: LinuxPayAsYouGoMLS },
            { License: "oneyearmls", Price: LinuxOneYearMLS },
            { License: "threeyearmls", Price: LinuxThreeYearMLS },
        ]
    });
    AzureCompute.push({
        VmType: "Biztalk", TotalVms: Biztalk, Items: [
            { License: "payasyougo", Price: BiztalkPayAsYouGoPrice },
            { License: "payasyougohybrid", Price: BiztalkPayAsYouGoHybridPrice },
            { License: "oneyear", Price: BiztalkOneYearPrice },
            { License: "oneyearhybrid", Price: BiztalkOneYearHybridPrice },
            { License: "threeyear", Price: BiztalkThreeYearPrice },
            { License: "threeyearhybrid", Price: BiztalkThreeYearHybrid },
            { License: "payasyougomls", Price: BiztalkPayAsYouGoMLS },
            { License: "oneyearmls", Price: BiztalkOneYearMLS },
            { License: "threeyearmls", Price: BiztalkThreeYearMLS },
        ]
    });
    AzureCompute.push({
        VmType: "PostgreSQL", TotalVms: PostgreSQL, Items: [
            { License: "payasyougo", Price: PostgreSQLPayAsYouGoPrice },
            { License: "oneyear", Price: PostgreSQLOneYearPrice },
            { License: "threeyear", Price: PostgreSQLThreeYearPrice }
        ]
    });
    AzureCompute.push({
        VmType: "LiftandShiftPostgreSQL", TotalVms: LiftandShiftPostgreSQL, Items: [
            { License: "payasyougo", Price: LiftandShiftPostgreSQLPayAsYouGoPrice },
            { License: "payasyougohybrid", Price: LiftandShiftPostgreSQLPayAsYouGoHybridPrice },
            { License: "oneyear", Price: LiftandShiftPostgreSQLOneYearPrice },
            { License: "oneyearhybrid", Price: LiftandShiftPostgreSQLOneYearHybridPrice },
            { License: "threeyear", Price: LiftandShiftPostgreSQLThreeYearPrice },
            { License: "threeyearhybrid", Price: LiftandShiftPostgreSQLThreeYearHybrid },
            { License: "payasyougomls", Price: LiftandShiftPostgreSQLPayAsYouGoMLS },
            { License: "oneyearmls", Price: LiftandShiftPostgreSQLOneYearMLS },
            { License: "threeyearmls", Price: LiftandShiftPostgreSQLThreeYearMLS }
        ]
    });
    AzureCompute.push({
        VmType: "LiftandShiftSQL", TotalVms: LiftandShiftSQL, Items: [
            { License: "payasyougo", Price: LiftandShiftSQLPayAsYouGoPrice },
            { License: "payasyougohybrid", Price: LiftandShiftSQLPayAsYouGoHybridPrice },
            { License: "oneyear", Price: LiftandShiftSQLOneYearPrice },
            { License: "oneyearhybrid", Price: LiftandShiftSQLOneYearHybridPrice },
            { License: "threeyear", Price: LiftandShiftSQLThreeYearPrice },
            { License: "threeyearhybrid", Price: LiftandShiftSQLThreeYearHybrid },
            { License: "payasyougomls", Price: LiftandShiftSQLPayAsYouGoMLS },
            { License: "oneyearmls", Price: LiftandShiftSQLOneYearMLS },
            { License: "threeyearmls", Price: LiftandShiftSQLThreeYearMLS }
        ]
    });
    AzurePostgreStorage = { PostgreStorageInGb: PostgreStorageInGb, PostgreStorageCost: PostgreStorageCost };

    var AzureConfig = { AzureCompute: AzureCompute, AzureItLabour: AzureItLabour, AzureStorage: AzureStorage, AzureNetworking: AzureNetworking, AzurePostgreStorage: AzurePostgreStorage };
    return AzureConfig;
}
function GetBoylItemBasedOnAzureSize(AzureServiceSize, Item) {
    var BOYLItem = {};
    if (AzureServiceSize !== undefined || AzureServiceSize !== null) {
        angular.forEach(AzureServiceSize, function (value, key) {
            if (value.TypeID === 1 && value.RegionID === parseInt(Item.RegionID) && Item.AzureVmSize !== null && Item.AzureVmSize !== undefined) {
                if (value.AzureServiceSize1 !== undefined && value.AzureServiceSize1 !== null
                    && value.AzureServiceSize1.replace(' ', '').toLowerCase().trim() === Item.AzureVmSize.replace(' ', '').toLowerCase().trim()) {
                    BOYLItem = value;
                }
            }
        });
    }
    if (BOYLItem.length === 0) return Item;
    else
        return BOYLItem;
}
function GetTotalHardwareCost(HardwareConfig, years, sampleService) {
    var x = 0;
    angular.forEach(HardwareConfig, function (value, key) {
        x += value.HPrice;
    });
    var y = 0;
    //angular.forEach(sampleService.HostMachineDetail, function (value, key) {
    //    outputPrice = GetHostMachineData(sampleService.Assumptions.hardwareCost, value.TargetProcessor, value.TargetCorePerProcessor, value.TargetRam);
    //    y += outputPrice[0].Price;
    //});
    angular.forEach(sampleService.HostMachineDetail, function (value, key) {
        outputPrice = GetHostMachineData(sampleService.Assumptions.hardwareCost, value.TargetProcessor, value.NumberOfCores, value.RamInGB);
        if (outputPrice.length > 0) {
            y += outputPrice[0].Price;
        }
    });
    return (x + y);
}
function GetTotalBizTalkCost(BiztalkConfig, years) {
    var x = 0;
    angular.forEach(BiztalkConfig, function (value, key) {
        x += value.BiztalkPrice;
    });
    return x;
}
function GetTotalSoftwareWindowsCost(SoftwareConfig, WindowsLicenseCost) {
    var x = 0;
    var y = 0;
    var NoOfCores = 0;
    angular.forEach(SoftwareConfig, function (value, key) {
        if (value.Type == "HostMachine") {
            NoOfCores = value.Core * value.Processor;
            if (value.LicenseType.trim.toLowerCase == "datacenter") {
                if (NoOfCores <= 8) {
                    x += (WindowsLicenseCost[0].WindowsDatacenterLicenseCost * 8);
                }
                else if (NoOfCores > 8 && NoOfCores <= 10) {
                    x += (WindowsLicenseCost[0].WindowsDatacenterLicenseCost * 10);
                }
                else if (NoOfCores > 10 && NoOfCores <= 16) {
                    x += (WindowsLicenseCost[0].WindowsDatacenterLicenseCost * 16);
                }
                else {
                    x += (WindowsLicenseCost[0].WindowsDatacenterLicenseCost * NoOfCores);
                }
            }
            else {
                if (NoOfCores <= 8) {
                    x += (WindowsLicenseCost[1].WindowsDatacenterLicenseCost * 8);
                }
                else if (NoOfCores > 8 && NoOfCores <= 10) {
                    x += (WindowsLicenseCost[1].WindowsDatacenterLicenseCost * 10);
                }
                else if (NoOfCores > 10 && NoOfCores <= 16) {
                    x += (WindowsLicenseCost[0].WindowsDatacenterLicenseCost * 16);
                }
                else {
                    x += (WindowsLicenseCost[0].WindowsDatacenterLicenseCost * NoOfCores);
                }
            }
        }
        else if (value.Type == "PhysicalMachine") {
            if (value.LicenseType.trim.toLowerCase == "datacenter") {
                y += (WindowsLicenseCost[0].WindowsDatacenterLicenseCost * 8);
            }
            else {
                y += (WindowsLicenseCost[1].WindowsDatacenterLicenseCost * 8);
            }
        }
    });
    return x + y;
}
function GetTotalDatabaseCost1(databaseCost, vw_SQLVersionLicenseDetail) {

    var data = SqlVersionCostCalculation(vw_SQLVersionLicenseDetail, databaseCost);
    var total = 0;
    angular.forEach(data, function (value, key) {
        total += value.Cost;
    });
    return total;
}
function GetTotalSASqlCost(databaseCost, vw_SQLVersionLicenseDetail, years) {
    var data = SoftwareAssuranceSQLCostCalculation(vw_SQLVersionLicenseDetail, databaseCost, years);
    var SACostExpiredLicense = SqlVersionCostCalculation_SACostExpiredLicense(vw_SQLVersionLicenseDetail, databaseCost);
    var total = 0;
    angular.forEach(data, function (value, key) {
        total += value.SACost;
    });
    return (total + SACostExpiredLicense);
}
//Oracle
function GetTotalOracleDatabaseCost1(oracledatabaseCost, vw_OracleVersionLicenseDetail) {
    var data = OracleVersionCostCalculation(vw_OracleVersionLicenseDetail, oracledatabaseCost);
    var total = 0;
    angular.forEach(data, function (value, key) {
        total += value.Cost;
    });
    return total;
}
//AZURE Oracle
function GetAzureOracleCost1(oracledatabaseCost, vw_AzureOracleCost) {
    var data = AzureOracleCostCalculation(vw_AzureOracleCost, oracledatabaseCost);
    var total = 0;
    angular.forEach(data, function (value, key) {
        total += value.Cost;
    });
    return total;
}
function GetTotalDatabaseCost(databaseCost, DatabaseAssumptions, NumberOfYears) {
    var softwareassurancecost = 0;
    var standardSqlCost = 0;
    var enterpriseSQLCost = 0;
    angular.forEach(DatabaseAssumptions, function (value, key) {
        if (value.License === 'enterprisesqllicense')
            enterpriseSQLCost += CalculateSQLEnterpriseLicenseCost(databaseCost, value, NumberOfYears);
        else
            standardSqlCost += CalculateSQLStandardLicenseCost(databaseCost, value, NumberOfYears);
    });
    return (standardSqlCost + enterpriseSQLCost);
}
function CalculateSQLEnterpriseLicenseCost(databaseCost, dbObject, NumberOfYears) {
    var cost = 0;
    angular.forEach(databaseCost, function (value, key) {
        if (value.LicenseId == "enterprisesqllicense" && dbObject.SQL_ServerVersion == value.Sqlversion) {
            var sqlVersion = dbObject.SQL_ServerVersion.replace(/[^\d.]/g, '');
            if (parseInt(sqlVersion) < 2012) {
                cost = (dbObject.Cores / dbObject.Processors) * value.Cost * NumberOfYears;
            }
            else {
                cost = (dbObject.Cores / 2) * value.Cost * NumberOfYears;
            }
        }
    });
    return cost;
}
function CalculateSQLStandardLicenseCost(databaseCost, dbObject, NumberOfYears) {
    var cost = 0;
    var OldSqls = [];
    var sqlVersion = dbObject.SQL_ServerVersion.replace(/[^\d.]/g, '').substring(0, 4);
    if (parseInt(sqlVersion) >= 2012) {
        angular.forEach(databaseCost, function (value, key) {
            if (value.LicenseId == "standardsqllicense" && dbObject.SQL_ServerVersion == value.Sqlversion) {
                cost = (dbObject.Cores / 2) * value.Cost * NumberOfYears;
            }
        });
    }
    else {
        angular.forEach(databaseCost, function (value, key) {
            OldSqls.push({ Version: sqlVersion, Cores: dbObject.Cores, Procs: dbObject.Processors });
        });
        var oldSqlCost = CalculateOlDSqlCost(OldSqls);
    }
    return cost;
}
function CalculateOlDSqlCost(OldSqls) {
    //
    //console.log(removeDuplicates(OldSqls, 'Version'));
}
function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
function CalculateSoftwareAssuranceCost(databaseCost, dbObject, NumberOfYears) {
    var cost = 0;
    angular.forEach(databaseCost, function (value, key) {
        if (value.LicenseTypePerCore == "Software Assurance") {
            cost = (dbObject.Cores / 2) * value.Cost * NumberOfYears;
        }
    });
    return cost;
}
function GetTotalOn_premises_cost_breakdown(CostBreakDown) {
    var total = 0;
    angular.forEach(CostBreakDown, function (value, key) {
        total += value.Cost;
    });
    return total;
}
function GetDatamaintanenceCost(DatabaseAssumptions, Cost, NumberOfYears) {
    return GetTotalEnterpriseLicenseCores(DatabaseAssumptions) + GetTotalStandardLicensCores(DatabaseAssumptions) * Cost * NumberOfYears;
}
function GetTotalDatabaseLicenseCost(EnterpriseCost, EnterpriseCores, StandardCost, StandardCores) {
    return (EnterpriseCores * EnterpriseCost) + (StandardCost * StandardCores);
}
function GetTotalEnterpriseLicenseCores(DatabaseAssumptions) {
    var total = 0;
    angular.forEach(DatabaseAssumptions, function (value, key) {
        if (value.License == "enterprisesqllicense")
            total += value.Cores;
    });
    return total;
}
function GetTotalStandardLicensCores(DatabaseAssumptions) {
    var total = 0;
    angular.forEach(DatabaseAssumptions, function (value, key) {
        if (value.License == "standardsqllicense")
            total += value.Cores;
    });
    return total;
}
function TotalStorageCost(StorageAssumptions, Cost, Numberofyears) {
    var storage_procurement_cost = GetTotalStorageInGB(StorageAssumptions) * Cost;
    var maintenance_cost = storage_procurement_cost * 10 / 100 * Numberofyears;
    var total = storage_procurement_cost + maintenance_cost;
    return total;
}
function GetTotalStorageInGB(StorageAssumptions) {
    var total = 0;
    angular.forEach(StorageAssumptions, function (value, key) {
        total += value.UsedStorage != null || value.UsedStorage != undefined ? value.UsedStorage : 0;
    });
    total = total;
    return total;
}
function GetTotalUsedTapdrive(StorageAssumptions) {
    var total = 0;
    angular.forEach(StorageAssumptions, function (value, key) {
        total += value.UsedStorage != null || value.UsedStorage != undefined ? value.UsedStorage * 1.3 : 0;
    });
    total = total / 1024;
    total = Math.ceil(total / 6);
    return total;
}
function GetTotalStorageInGBFromListShift(StorageAssumptions) {
    var total = 0;
    angular.forEach(StorageAssumptions, function (value, key) {
        total += value.Used_Storage_GB_;
    });
    total = total;
    return total;
}
function TotalNetworkCostBreakdown(HardwareCost, SoftwareCost, PerOfHardSoft, MaintenancePer, PerGBCost, Bandwidth, NumberOfyear) {
    var TotalHardwareAndSoftCost = HardwareCost + SoftwareCost;
    var NetworkHardwareCost = TotalHardwareAndSoftCost * PerOfHardSoft / 100;
    var MaintainenceCost = NetworkHardwareCost * MaintenancePer / 100;
    var TotalServiceProviderCost = Bandwidth * PerGBCost * 12 * NumberOfyear;
    return NetworkHardwareCost + MaintainenceCost + TotalServiceProviderCost;
}
function GetDatabaseLicenseCost(databaseCost, LicenseType) {
    var licenseCost = '';
    angular.forEach(databaseCost, function (value, key) {
        if (value.LicenseId == LicenseType)
            licenseCost = value.Cost;
    });
    return licenseCost;
}
function CalculateIntrest(cost, growth, year) {
    var C = cost * (Math.pow((1 + (growth / 100)), year) - 1);
    var Total = (cost + C)
    return Total;
}
function TotalHardwareCostBreakdown(HardwareConfig, numyear) {
    var x = 0;
    angular.forEach(HardwareConfig, function (value, key) {
        x += value.Price * value.TotalServer;
    });
    var m = numyear > 1 ? (x * 20 / 100) * numyear : 0;
    return x + m;
}
function TotalSoftWareCostBreakDown(SoftwareConfig) {
    var y = 0;
    angular.forEach(SoftwareConfig, function (value, key) {
        y += value.Price;
    });
    return y;
}
function TotalElectricityCostBreakDown(ElectricityConfig, PricePerKiloWatt, Numberofyears) {
    var z = 0;
    angular.forEach(ElectricityConfig, function (value, key) {
        z += (value.PowerRating / 1000) * PricePerKiloWatt * 730;
    });
    return z * 12 * Numberofyears;
}
function TotalRacksRequired(DataCenterConfig) {
    var Total = 0;
    angular.forEach(DataCenterConfig, function (value, key) {
        Total += value.RackUnitsRequired * value.TotalServer;
    });
    return Total;
}
function GetTotalServers(DataCenterConfig) {
    var Total = 0;
    angular.forEach(DataCenterConfig, function (value, key) {
        Total += value.TotalServer;
    });
    return Total;
}
function TotalDataCenterCost(DataCenterConfig, NumberOfYears) {
    var Total = (DataCenterConfig.DataCenterConstructionCost.constructionCost / DataCenterConfig.DataCenterConstructionCost.Life * NumberOfYears) *
        (Math.ceil(TotalRacksRequired(DataCenterConfig) / DataCenterConfig.DataCenterConstructionCost.UnitsPerRack))
    return Total;
}
function HardwareCost(HardwareCost, sampleService, NumberOfServer, year) {
    var CoreCost = HardwareCost == undefined ? 1400 : HardwareCost.Price;
    var total = (CoreCost * NumberOfServer);
    return total;
}
function DataCenterCost(sampleService, year, TotalRackRequired) {
    var constructionCost = sampleService.DataCenterConstructionCost.constructionCost;
    var life = sampleService.DataCenterConstructionCost.Life;
    if (TotalRackRequired > 42) {
        TotalRackRequired = Math.ceil(TotalRackRequired / 42);
    }
    var Cost = ((constructionCost / life) * year) * (TotalRackRequired) * (constructionCost / life * year);
    return Cost;
}
function ItLabourCost(NumberOfServersManagedByAdmin, HourlyRate, year) {
    var HoursInAYear = 8000;
    return ((8000 / (NumberOfServersManagedByAdmin * 4)) * HourlyRate) * year;
}
function NetworkingCost(HardwareCost, SoftwareCost, NetworkHardSoftPer, NetworkMaintenancePer, CostPerGb, BandWidthInGB, year) {
    var NetworkHardSoftCost = ((HardwareCost + SoftwareCost) * NetworkHardSoftPer) / 100;
    var Network_maintenance_cost = (NetworkHardSoftCost * NetworkMaintenancePer) / 100;
    var Total_service_provider_cost = CostPerGb * BandWidthInGB * 12 * year;
    return NetworkHardSoftCost + Network_maintenance_cost + Total_service_provider_cost;

}
function ElectricityCost(ElectricityWatts, NumberOfYears, perKilowattCost) {
    var Cost = (((ElectricityWatts.PowerRating / 1000) * 730) * perKilowattCost) * 12;
    return Cost;
}
function SoftwareCost(NumberOfServer, WindowsDatacenterLicenseCost) {
    return WindowsDatacenterLicenseCost * NumberOfServer;
}
function StorageCost(CostPerGb, TotalInGb, storage_procurement_Percentage, year) {
    var StorageCost = (CostPerGb * TotalInGb);
    var Storage_maintenance_cost = ((StorageCost * storage_procurement_Percentage) / 100) * year;
    return (StorageCost + Storage_maintenance_cost);
}
function getSoftwareCostBasedOnCore(numberOfCore, SoftwareArray) {
    var Price = 0;
    if (numberOfCore >= 20 && numberOfCore <= 32) {
        Price = 9260.64;
    }
    for (var i = 0; i < SoftwareArray.length; i++) {
        if (SoftwareArray[i].NoOfCore >= numberOfCore) {
            Price = SoftwareArray[i].WindowsDatacenterLicenseCost;
            break;
        }
    }
    return Price;
}
function getSoftwareCostBasedOnOS(currentos, SoftwareAssumptions) {
    var price = 0;
    angular.forEach(SoftwareAssumptions, function (value, key) {
        if (value.OS == currentos) {
            price = value.Pricing;
        }
    });
    return price;
}
function getBiztalkCostBasedOnOS(currentos, BizTalkAssumption) {
    var price = 0; var OSBiztalk = '';
    if (currentos.indexOf('Enterprise') > -1) {
        OSBiztalk = 'Enterprise';
    }
    else if (currentos.indexOf('Standard') > -1) {
        OSBiztalk = 'Standard';
    }
    else if (currentos.indexOf('Branch') > -1) {
        OSBiztalk = 'Branch';
    }
    else if (currentos.indexOf('Developer') > -1) {
        OSBiztalk = 'Developer';
    }
    angular.forEach(BizTalkAssumption, function (value, key) {
        if (value.OS == OSBiztalk) {
            price = value.Price;
        }
    });
    return price;
}
function databaseLoad(DatabaseAssumptions, databaseCost, NumberOfYears) {
    var dbAssumptions = [];
    angular.forEach(DatabaseAssumptions, function (value, key) {
        if (value.License === 'enterprisesqllicense') {
            value.Cost = CalculateSQLEnterpriseLicenseCost(databaseCost, value, NumberOfYears);
        }
        else {
            value.Cost = CalculateSQLStandardLicenseCost(databaseCost, value, NumberOfYears);
        }
        dbAssumptions.push(value);
    });
    return dbAssumptions;
}
function GetHostMachineData(sampleService, TargetProcessor, TargetCorePerProcessor, TargetRam) {
    var lstFinalPrice = [];
    //angular.forEach(sampleService, function (value, key) {
    //   if ((value.Processor == TargetProcessor) && (value.CorePerProcessor == TargetCorePerProcessor) && (value.Ram == TargetRam)) {
    //        lstFinalPrice.push(value);
    //    }
    //});
    angular.forEach(sampleService, function (value, key) {
        if (TargetCorePerProcessor == 1) {
            if (((value.Processor * value.CorePerProcessor) >= TargetCorePerProcessor)) {
                lstFinalPrice.push(value);
            }
        }
        else {
            if (((value.Processor * value.CorePerProcessor) >= (TargetCorePerProcessor / 2))) {
                lstFinalPrice.push(value);
            }
        }
    });
    return lstFinalPrice;
}
function GetHardwareCost(sampleService, Procsperserver, Coreperproc, ram) {
    var lstRam = [];
    var lstCoreperproc = [];
    var lstProcsperserver = [];
    var lstFinalPrice = [];
    angular.forEach(sampleService, function (value, key) {
        if (value.Processor >= Procsperserver) {
            lstProcsperserver.push(value);
        }
    });
    if (lstProcsperserver != null && lstProcsperserver.length > 0) {
        angular.forEach(lstProcsperserver, function (value, key) {
            if (value.CorePerProcessor >= Coreperproc) {
                lstCoreperproc.push(value);
            }
        });
    }
    else {
        angular.forEach(sampleService, function (value, key) {
            if (value.Ram >= (ram * 2)) {
                lstCoreperproc.push(value);
            }
        });
    }
    if (lstCoreperproc != null && lstCoreperproc.length > 0) {
        angular.forEach(lstCoreperproc, function (value, key) {



            if (value.Ram >= ram) {
                lstRam.push(value);
            }
        });
    }
    else {
        for (var k = 0; k < sampleService.length; k++) {
            if (sampleService[k].CorePerProcessor > Coreperproc) {
                lstRam.push(sampleService[k - 1]);
                break;
            }
        }
        if (lstRam.length == 0)
            lstRam.push(sampleService[k - 1]);
    }
    if (lstRam == null && lstRam.length == 0) {
        angular.forEach(sampleService, function (value, key) {
            if (value.Ram >= (ram * 2)) {
                lstRam.push(value);
            }
        });
    }
    if (Coreperproc != null && Coreperproc != 0) {
        angular.forEach(sampleService, function (value, key) {
            if (Coreperproc <= 8) {
                if (((value.CorePerProcessor * value.Processor) >= Coreperproc)) {
                    lstFinalPrice.push(value);
                }
            }
            else {
                if (((value.CorePerProcessor * value.Processor) == 8)) {
                    lstFinalPrice.push(value);
                }
            }
        });
    }
    //var minRam = Math.min.apply(Math, lstRam.map(function (item) { return item.Ram; }));
    //if (lstRam != null && lstRam.length > 0) {
    //    angular.forEach(lstRam, function (value, key) {
    //        if (value.Ram == minRam) {
    //            lstFinalPrice.push(value);
    //        }

    //    });
    //}
    else {
        alert('Core:' + Coreperproc + 'Ram:' + ram + 'Processor:' + Procsperserver);
    }
    return lstFinalPrice;
}
function closestValueRam(array, value) {
    var result,
        lastDelta;
    array.some(function (item) {
        var delta = Math.abs(value - item.Ram);
        if (delta >= lastDelta) {
            return true;
        }
        result = item;
        lastDelta = delta;
    });
    return result;
}
function closestValueProc(array, value) {
    var result,
        lastDelta;

    array.some(function (item) {
        var delta = Math.abs(value - item.Ram);
        if (delta >= lastDelta) {
            return true;
        }
        result = item;
        lastDelta = delta;
    });
    return result;
}
function closestValueCore(array, value) {
    var result,
        lastDelta;
    array.some(function (item) {
        var delta = Math.abs(value - item.Ram);
        if (delta >= lastDelta) {
            return true;
        }
        result = item;
        lastDelta = delta;
    });
    return result;
}
function CashFlowObject(sampleService, finance) {
    var MigrationExcel = sampleService.MigrationExcel[0];
    var capitalPer = sampleService.CostofCapitalPer;
    var CashFlowExcel = [
        {
            Type: "Benefits Realized",
            CapitalCost: sampleService.CostofCapitalPer,
            BenefitsRealizedRate0: sampleService.BenefitsRealizedRate0,
            BenefitsRealizedRate1: sampleService.BenefitsRealizedRate1,
            BenefitsRealizedRate2: sampleService.BenefitsRealizedRate2,
            BenefitsRealizedRate3: sampleService.BenefitsRealizedRate3,
            BenefitsRealizedRate4: sampleService.BenefitsRealizedRate4,
            TotalVM: sampleService.TotalVMMigration,
            Undiscounted_Cash_Flows: [{
                Type: "CashIn",
                OneYear: sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000,
                TwoYear: sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000,
                ThreeYear: sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000,
                FourYear: sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000,
                FiveYear: sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000,
                Total: getTotalNetcashin(sampleService)
            },
            {
                Type: "CashOut",
                OneYear: MigrationExcel[6].value / 1000000,
                TwoYear: 0,
                ThreeYear: 0,
                FourYear: 0,
                FiveYear: 0,
                Total: MigrationExcel[6].value / 1000000
            },
            {
                Type: "NetCashFlow",
                OneYear: (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000),
                TwoYear: sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000,
                ThreeYear: sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000,
                FourYear: sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000,
                FiveYear: sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000,
                Total: getTotalNetCashFlow(sampleService, sampleService.MigrationExcel[0])
            }
            ],
            Discounted_Cash_Flows: [{
                Type: "CashIn",
                OneYear: (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0),
                TwoYear: (sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1),
                ThreeYear: (sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2),
                FourYear: (sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3),
                FiveYear: (sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4),
                Total: DiscountedCashFlows(sampleService)

            },
            {
                Type: "CashOut",
                OneYear: -((MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)),
                TwoYear: 0,
                ThreeYear: 0,
                FourYear: 0,
                FiveYear: 0,
                Total: -((MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)),
            },
            {
                Type: "NetCashFlow",
                OneYear: (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0) + (-(MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)),
                TwoYear: (sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1),
                ThreeYear: (sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2),
                FourYear: (sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3),
                FiveYear: (sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4),
                Total: GetDiscountedNetCashFlow(sampleService, sampleService.MigrationExcel[0])
            },
            {
                Type: "CumulativeNCF",
                OneYear: (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))),
                TwoYear: ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)),
                ThreeYear: ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)),
                FourYear: ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)),
                FiveYear: ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4))
            }
            ],
            TCO: (MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0),
            NPV: CalculateNPV(sampleService, sampleService.MigrationExcel[0]),
            IRR: CalculateIRR(sampleService, sampleService.MigrationExcel[0], finance),
            PaybackYearsFraction: ((GetPayBackYear([((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)), (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)), ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)), (((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)), ((((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4))])) - 1) + (GetPayBackYearFarction([GetPayBackFraction((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1), ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)), (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))), GetPayBackFraction((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2), (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)), ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))), GetPayBackFraction((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4), ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)), (((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))), GetPayBackFraction((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4), (((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)), ((((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4))), GetPayBackFraction((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4)), ((((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4)), 0)], GetPayBackYear([((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)), (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)), ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)), (((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)), ((((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4))]))),
            PaybackYears: GetPayBackYear(
                [((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) -
                    (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)),
                (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) -
                    (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) +
                ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)),
                ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) -
                    (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) +
                    ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) +
                ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)),
                (((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) -
                    (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) +
                    ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) +
                    ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) +
                ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)),
                ((((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) -
                    (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) +
                    ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) +
                    ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) +
                    ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))) +
                ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4))]),
            Payback: [{
                Type: "PaybackFracByPeriod",
                OneYear: GetPayBackFraction((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1),
                    ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) -
                    (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)),
                    (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) -
                        (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000)
                            / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))),
                TwoYear: GetPayBackFraction((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2), (((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)), ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))),
                ThreeYear: GetPayBackFraction((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4), ((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)), (((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))),
                FourYear: GetPayBackFraction((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4), (((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)), ((((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4))),
                FiveYear: GetPayBackFraction((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4)), ((((((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) - (MigrationExcel[6].value / 1000000 / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))) + ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))) + ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))) + ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))) + ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4)), 0),
            }]
        }
    ]
    return CashFlowExcel;
}
function MigrationInputExcel(sampleService) {
    var ExcelObjData = [];
    if (sampleService.MigrationStatus == true) {
        var b;
        if (sampleService.migrationData[7].value * 3.2 < 40) {
            b = 40;
        }
        else {
            b = Math.ceil(sampleService.migrationData[7].value * 3.2)

        }
        RedesignCost = [{ Type: " Redesign Operational Model Cost ", value: sampleService.migrationData[0].value },
        { Type: " Internal Resource Cost ", value: sampleService.migrationData[1].value },
        { Type: " Project Management Cost ", value: sampleService.migrationData[2].value },
        { Type: "  Complete Azure IaaS Foundation (Infra Set Up)(Vms * Assessment Cost)  ", value: sampleService.migrationData[3].value },
        //{ Type: "  Migration cost to Azure(Vms * Lift & Shift Cost)  ", value: sampleService.migrationData[4].value },
        { Type: " Storage Migration ", value: sampleService.migrationData[4].value },
        { Type: "Risk @ 20%", value: sampleService.migrationData[5].value },
        { Type: "Total Costs of Deployment", value: sampleService.migrationData[6].value },
        // Assumptions
        { Type: "Total VM Moved to cloud", value: sampleService.migrationData[7].value },
        { Type: "VM Moved to cloud(%)", value: sampleService.migrationData[8].value },
        { Type: "VM Moved to cloud", value: sampleService.migrationData[9].value },
        { Type: "Through-put (weekly rate)", value: sampleService.migrationData[10].value },
        { Type: "Time Required(Required week to move All Vms)", value: sampleService.migrationData[11].value },
        { Type: "EA (hours) for Operation Model Planning - Roadmap to operations needed for migration on azure like POC, Customer Interaction, Documentation", value: sampleService.migrationData[12].value },
        { Type: "Per TB Storage Migration", value: sampleService.migrationData[13].value },
        { Type: "Internal Consultant (hours)", value: sampleService.migrationData[14].value },
        { Type: "Project Management (Hours)", value: sampleService.migrationData[15].value }
        ];
        ExcelObjData.push(RedesignCost);
    }
    else {
        var b;
        if (sampleService.TotalVMMigration * 3.2 < 40) {
            b = 40;
        }
        else {
            b = Math.ceil(sampleService.TotalVMMigration * 3.2)
        }
        var TotalStorageInGB = GetTotalStorageInGB(sampleService.ServerAssumptions);
        RedesignCost = [{ Type: " Redesign Operational Model Cost ", value: (sampleService.TotalVMMigration * 1 * sampleService.MigrationAssumptions[0].subItems[0].value0) },
        { Type: " Internal Resource Cost ", value: (b * sampleService.MigrationAssumptions[0].subItems[2].value2) },
        { Type: " Project Management Cost ", value: (sampleService.TotalVMMigration * 1.5 * sampleService.MigrationAssumptions[0].subItems[3].value3) },
        { Type: "  Complete Azure IaaS Foundation (Infra Set Up)(Vms * Assessment Cost)  ", value: (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[4].value4) },
        //{ Type: "  Migration cost to Azure(Vms * Lift & Shift Cost)  ", value: Math.ceil(((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[5].value5) },
        { Type: " Storage Migration ", value: ((TotalStorageInGB / 1024) * 1.3 * sampleService.MigrationAssumptions[0].subItems[1].value1) },
        //{ Type: "Risk @ 20%", value: ((((sampleService.TotalVMMigration * 1 * sampleService.MigrationAssumptions[0].subItems[0].value0) + (b * sampleService.MigrationAssumptions[0].subItems[2].value2) + (sampleService.TotalVMMigration * 1.5 * sampleService.MigrationAssumptions[0].subItems[3].value3)) + (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[4].value4) + (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[5].value5) + ((TotalStorageInGB / 1024) * 1.3 * sampleService.MigrationAssumptions[0].subItems[1].value1)) * 20 / 100).toFixed(2) },
        { Type: "Risk @ 20%", value: ((((sampleService.TotalVMMigration * 1 * sampleService.MigrationAssumptions[0].subItems[0].value0) + (b * sampleService.MigrationAssumptions[0].subItems[2].value2) + (sampleService.TotalVMMigration * 1.5 * sampleService.MigrationAssumptions[0].subItems[3].value3)) + (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[4].value4) + ((TotalStorageInGB / 1024) * 1.3 * sampleService.MigrationAssumptions[0].subItems[1].value1)) * 20 / 100) },
        //{
        //    Type: "Total Costs of Deployment", value: ((sampleService.TotalVMMigration * 1 * sampleService.MigrationAssumptions[0].subItems[0].value0) +
        //        (b * sampleService.MigrationAssumptions[0].subItems[2].value2) +
        //        (sampleService.TotalVMMigration * 1.5 * sampleService.MigrationAssumptions[0].subItems[3].value3) +
        //        (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[4].value4) + (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[5].value5) +
        //        ((TotalStorageInGB / 1024) * 1.3 * sampleService.MigrationAssumptions[0].subItems[1].value1) + (((sampleService.TotalVMMigration * 1 * sampleService.MigrationAssumptions[0].subItems[0].value0) +
        //            (b * sampleService.MigrationAssumptions[0].subItems[2].value2) +
        //            (sampleService.TotalVMMigration * 1.5 * sampleService.MigrationAssumptions[0].subItems[3].value3) +
        //            (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[4].value4) + (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[5].value5) +
        //            ((TotalStorageInGB / 1024) * 1.3 * sampleService.MigrationAssumptions[0].subItems[1].value1)) * 20 / 100)).toFixed(2)
        //},
        {
            Type: "Total Costs of Deployment", value: ((sampleService.TotalVMMigration * 1 * sampleService.MigrationAssumptions[0].subItems[0].value0) +
                (b * sampleService.MigrationAssumptions[0].subItems[2].value2) +
                (sampleService.TotalVMMigration * 1.5 * sampleService.MigrationAssumptions[0].subItems[3].value3) +
                (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[4].value4) +
                ((TotalStorageInGB / 1024) * 1.3 * sampleService.MigrationAssumptions[0].subItems[1].value1) + (((sampleService.TotalVMMigration * 1 * sampleService.MigrationAssumptions[0].subItems[0].value0) +
                    (b * sampleService.MigrationAssumptions[0].subItems[2].value2) +
                    (sampleService.TotalVMMigration * 1.5 * sampleService.MigrationAssumptions[0].subItems[3].value3) +
                    (((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) * sampleService.MigrationAssumptions[0].subItems[4].value4) +
                    ((TotalStorageInGB / 1024) * 1.3 * sampleService.MigrationAssumptions[0].subItems[1].value1)) * 20 / 100)).toFixed(2)
        },
        // Assumptions
        { Type: "Total VM Moved to cloud", value: sampleService.ReconLiftandShift_InputData.length },
        { Type: "VM Moved to cloud(%)", value: sampleService.VMPer },
        { Type: "VM Moved to cloud", value: Math.ceil((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100) },
        { Type: "Through-put (weekly rate)", value: sampleService.VMThroughputRate },
        { Type: "Time Required(Required week to move All Vms)", value: ((sampleService.ReconLiftandShift_InputData.length * sampleService.VMPer) / 100 / sampleService.VMThroughputRate) },
        { Type: "EA (hours) for Operation Model Planning - Roadmap to operations needed for migration on azure like POC, Customer Interaction, Documentation", value: Math.ceil(sampleService.TotalVMMigration * 1) },
        { Type: "Per TB Storage Migration", value: (((TotalStorageInGB) / 1024) * 1.3) },
        { Type: "Internal Consultant (hours)", value: Math.floor(b) },
        { Type: "Project Management (Hours)", value: Math.ceil(sampleService.TotalVMMigration * 1.5) }

        ];
        ExcelObjData.push(RedesignCost);
    }
    return ExcelObjData;
}
function GetPayBackYearFarction(Range, fraction) {
    return Range[fraction - 1];
}
function GetPayBackYear(Range) {
    var count = 0;
    for (var i = 0; i < Range.length; i++) {
        if (Range[i] <= 0) {
            count++;
        }
    }
    // for No Error
    if (count == 0) {
        count++;;
    }
    //---------------------------------
    return count;
}
function GetPayBackFraction(Val1, Val2, Val3) {
    if (Val3 < 0) {
        return Val2 / Val1;
    } else {
        return Math.abs(Val2 / Val1);
    }
}
function NPV(Value1, Value, Range) {
    var sum = 0.0;
    for (var i = 0; i < Range.length; i++) {
        sum += Range[i] / Math.pow(1 + Value / 100, i);
    }
    return sum + Value1;
}
function IRR(Range, finance) {
    if (Range.length == 5) {
        var val = Math.ceil(finance.IRR(Range[0], Range[1], Range[2], Range[3], Range[4]));
        return val;
    }
    if (Range.length == 4) {
        var val = Math.ceil(finance.IRR(Range[0], Range[1], Range[2], Range[3]));
        return val;
    }
    if (Range.length == 3) {
        var val = Math.ceil(finance.IRR(Range[0], Range[1], Range[2]));
        return val;
    }
    if (Range.length == 2) {
        var val = Math.ceil(finance.IRR(Range[0], Range[1]));
        return val;
    }
    if (Range.length == 1) {
        var val = Math.ceil(finance.IRR(Range[0], 0.50));
        return val;
    }
}
function MathPow(Base, Exponent) {
    return Math.pow(Base, Exponent);
}
function getDataCumulative(CashFlowExcel, sampleService) {
    var x = [];
    if (sampleService.years == 5) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].FourYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].FiveYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 4) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].FourYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 3) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].ThreeYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 2) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].TwoYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 1) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[3].OneYear.toFixed(2));
        return x;
    }
}
function getDataDiscountedCashIn(CashFlowExcel, sampleService) {
    var x = [];
    if (sampleService.years == 5) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].FourYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].FiveYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 4) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].FourYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 3) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].ThreeYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 2) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].TwoYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 1) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[0].OneYear.toFixed(2));
        return x;
    }
}
function getDataDiscountedCashOut(CashFlowExcel, sampleService) {
    var x = [];
    if (sampleService.years == 5) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].FourYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].FiveYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 4) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].FourYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 3) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].ThreeYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 2) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].TwoYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 1) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[1].OneYear.toFixed(2));
        return x;
    }
}
function CheckDataOnPremises(ServerAssumptions) {
    if (typeof ServerAssumptions == undefined || ServerAssumptions === null)
        return true;
    else
        return false;
}
function CheckLiftShiftData(ReconLiftShift) {
    if (typeof ReconLiftShift == undefined || ReconLiftShift === null)
        return true;
    else
        return false;
}
function getDataDiscountedNetCash(CashFlowExcel, sampleService) {
    var x = [];
    if (sampleService.years == 5) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].FourYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].FiveYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 4) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].ThreeYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].FourYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 3) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].TwoYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].ThreeYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 2) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].OneYear.toFixed(2));
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].TwoYear.toFixed(2));
        return x;
    }
    if (sampleService.years == 1) {
        x.push(CashFlowExcel[0].Discounted_Cash_Flows[2].OneYear.toFixed(2));
        return x;
    }
}
function getcategory(sampleService) {
    var x = [];

    if (sampleService.years == 5) {
        x.push(1);
        x.push(2);
        x.push(3);
        x.push(4);
        x.push(5);
        return x;
    }
    if (sampleService.years == 4) {
        x.push(1);
        x.push(2);
        x.push(3);
        x.push(4);
        return x;
    }
    if (sampleService.years == 3) {
        x.push(1);
        x.push(2);
        x.push(3);
        return x;
    }
    if (sampleService.years == 2) {
        x.push(1);
        x.push(2);
        return x;
    }
    if (sampleService.years == 1) {
        x.push(1);
        return x;
    }
}
function getTotalNetCashFlow(sampleService, MigrationExcel) {
    if (sampleService.years == 1) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)).toFixed()
    }
    else if (sampleService.years == 2) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) + (sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000)) - (MigrationExcel[6].value / 1000000)
    }
    else if (sampleService.years == 3) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) + (sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000)
            + (sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000)) - (MigrationExcel[6].value / 1000000)
    }
    else if (sampleService.years == 4) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) + (sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000)
            + (sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) + (sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000)) - (MigrationExcel[6].value / 1000000)
    }
    else if (sampleService.years == 5) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) + (sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000)
            + (sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) + (sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000)
            + (sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000)) - (MigrationExcel[6].value / 1000000)
    }
}
function getTotalNetcashin(sampleService) {
    if (sampleService.years == 1) {
        return sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000;
    }
    else if (sampleService.years == 2) {
        return sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000 + sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000;
    }
    else if (sampleService.years == 3) {
        return sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000 + sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000
            + sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000;
    }
    else if (sampleService.years == 4) {
        return sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000 + sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000
            + sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000 + sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000;
    }
    else if (sampleService.years == 5) {
        return sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000 + sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000
            + sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000 + sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000 +
            sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000;
    }
}
function DiscountedCashFlows(sampleService) {
    if (sampleService.years == 1) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0));
    }
    else if (sampleService.years == 2) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1));
    }
    else if (sampleService.years == 3) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) +
            ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2));
    }
    else if (sampleService.years == 4) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) +
            ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) +
            ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3));
    }
    else if (sampleService.years == 5) {
        return ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) +
            ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) +
            ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)) +
            ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4));
    }
}
function GetDiscountedNetCashFlow(sampleService, MigrationExcel) {
    if (sampleService.years == 1) {
        return (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0) + (-(MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0))
    }
    else if (sampleService.years == 2) {
        return (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0) + (-(MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1))
    }
    else if (sampleService.years == 3) {
        return (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0) + (-(MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) +
            ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2))
    }
    else if (sampleService.years == 4) {
        return (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0) + (-(MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) +
            ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) +
            ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3))
    }
    else if (sampleService.years == 5) {
        return (sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0) + (-(MigrationExcel[6].value / 1000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 0)) +
            ((sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 1)) +
            ((sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 2)) +
            ((sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 3)) +
            ((sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000) / MathPow((1 + sampleService.CostofCapitalPer / 100), 4))
    }
}
function CalculateNPV(sampleService, MigrationExcel) {
    if (sampleService.years == 1) {
        return NPV(
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)), sampleService.CostofCapitalPer,
            [(sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)
            ]
        )
    }
    else if (sampleService.years == 2) {
        return NPV(
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)), sampleService.CostofCapitalPer,
            [
                sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000]
        )
    }
    else if (sampleService.years == 3) {
        return NPV(
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)), sampleService.CostofCapitalPer,
            [
                sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000,
                sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000]
        )
    }
    else if (sampleService.years == 4) {
        return NPV(
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)), sampleService.CostofCapitalPer,
            [
                sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000,
                sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000,
                sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000]
        )
    }
    else if (sampleService.years == 5) {
        return NPV(
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)), sampleService.CostofCapitalPer,
            [
                sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000,
                sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000,
                sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000,
                sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000]
        )
    }
}
function CalculateIRR(sampleService, MigrationExcel, finance) {
    if (sampleService.years == 1) {
        return IRR([
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000))], finance)
    }
    else if (sampleService.years == 2) {
        return IRR([
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)),
            sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000], finance)
    }
    else if (sampleService.years == 3) {
        return IRR([
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)),
            sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000, sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000], finance)
    }
    else if (sampleService.years == 4) {
        return IRR([
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)),
            sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000, sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000,
            sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000], finance)
    }
    else if (sampleService.years == 5) {
        return IRR([
            ((sampleService.RentingBenifits[7].year1.Total * sampleService.BenefitsRealizedRate0 / 100000000) - (MigrationExcel[6].value / 1000000)),
            sampleService.RentingBenifits[7].year2.Total * sampleService.BenefitsRealizedRate1 / 100000000, sampleService.RentingBenifits[7].year3.Total * sampleService.BenefitsRealizedRate2 / 100000000,
            sampleService.RentingBenifits[7].year4.Total * sampleService.BenefitsRealizedRate3 / 100000000, sampleService.RentingBenifits[7].year5.Total * sampleService.BenefitsRealizedRate4 / 100000000], finance)
    }
}
function TestIRR(arg1, arg2, arg3, arg4, arg5, out, IRR) {
    if (exe(arg1, arg2, arg3, arg4, arg5, out, IRR) <= 0) {
        return IRR;
    }
    else {
        TestIRR(arg1, arg2, arg3, arg4, arg5, out, ++IRR);
    }
}
function exe(arg1, arg2, arg3, arg4, arg5, out, IRR) {
    var res = out + (arg1 / (1 + IRR)) + (arg2 / ((1 + IRR) * (1 + IRR))) + (arg3 / ((1 + IRR) * (1 + IRR) * (1 + IRR))) + (arg4 / ((1 + IRR) * (1 + IRR) * (1 + IRR) * (1 + IRR))) + (arg5 / ((1 + IRR) * (1 + IRR) * (1 + IRR) * (1 + IRR) * (1 + IRR)));
    return res;
}
function CalculateSavedBenifits(sampleService, Year, Category, $scope) {
    if (sampleService.IsUserCostSavedStatus === true) {
        if (Category === "Hardware") {
            var Total = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (Category.toLowerCase() === value.Type.toLowerCase())) {
                    Total += value.OnPremise;
                }
                if ((value.Year.search(Year) === 0) && ("hardware maintenance cost" === value.Type.toLowerCase())) {
                    Total += value.OnPremise;
                }

            });
            return Total;
        }
        else if (Category === "Software") {
            if (sampleService.IsUserCostSavedStatus === true && sampleService.IsAzureCostSavedStatus === true) {
                var TotalSavedOnpremise = 0;
                var TotalSavedAzure = 0;
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if ((value.Year.search(Year) === 0) && (value.Type === "Software (Linux)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Software (Windows)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sql License Cost")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += sampleService.tcoType === "postgre" ? value.Azure : 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(SQL)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Windows License)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Linux License)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "BizTalk")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Oracle License")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Oracle)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "DR Cost")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                });
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if ((value.Year.search(Year) === 0) && (value.Type === "Hardware")) {
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Hardware Maintenance Cost")) {
                        TotalSavedAzure += value.Azure;
                    }
                });
                return Total = TotalSavedOnpremise - (TotalSavedAzure);
            }
            else {
                var planSelected = $scope.plan === undefined || $scope.plan === null ? 'payasyougo' : $scope.plan;
                //var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : 'sql';
                var tcoType = sampleService.tcoType === undefined || sampleService.tcoType === null || sampleService.tcoType === 'all' ? 'all' : tcoType === 'sql' ? 'sql' : 'postgre';
                var hardware = $scope.AzureVmCost(planSelected);
                var hardwaremaintancecost = (tcoType === 'all' ? $scope.AzureSqlCost(planSelected) : $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew));
                var azurebiztokCost = $scope.AzureBiztalkCost();
                var azurelinexCost = $scope.AzureLinuxCost(planSelected);

                var TotalSavedOnpremise = 0;
                var TotalSavedAzure = 0;
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if ((value.Year.search(Year) === 0) && (value.Type === "Software (Linux)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += CalculateIntrest(azurelinexCost, 5, Year);
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Software (Windows)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sql License Cost")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += sampleService.tcoType === "postgre" ? value.Azure : 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(SQL)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Windows License)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Linux License)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "BizTalk")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += CalculateIntrest(azurebiztokCost, 5, Year);
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Oracle License")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Oracle)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "DR Cost")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += value.Azure;
                    }
                });
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if ((value.Year.search(Year) === 0) && (value.Type === "Hardware")) {
                        TotalSavedAzure += CalculateIntrest(hardware, 5, Year - 1);
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Hardware Maintenance Cost")) {
                        TotalSavedAzure += CalculateIntrest(hardwaremaintancecost, 5, Year - 1);
                    }
                });
                return Total = TotalSavedOnpremise - TotalSavedAzure;
            }
        }
        else if ((Category === "Electricity") || (Category === "Data Center") || (Category === "IT Labor")) {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (Category.toLowerCase() === value.Type.toLowerCase())) {
                    TotalSavedOnpremise += value.OnPremise;
                    TotalSavedAzure += value.Azure;
                }
            });
            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }
        else if ((Category === "Storage")) {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === 'storage hardware cost' || value.Type.toLowerCase() === 'backup and archive cost' || value.Type.toLowerCase() === 'storage maintenance cost')) {
                    TotalSavedOnpremise += value.OnPremise;
                    TotalSavedAzure += value.Azure;
                }
            });
            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }
        else if (Category === "Networking") {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "bandwidth")) {
                    TotalSavedOnpremise += value.OnPremise;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "azure advisor")) {
                    TotalSavedOnpremise += value.OnPremise;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "azure security center")) {
                    TotalSavedOnpremise += value.OnPremise;
                }
            });
            angular.forEach(sampleService.viewMoreDetail, function (value1, key1) {
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if ((value.Year.search(Year) === 0) && ((value.Type.toLowerCase().trim() === value1.Type.toLowerCase().trim()))) {
                        TotalSavedAzure += value.Azure;
                    }
                });
            });
            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }
    }
}

function CalculateSavedBenifitsAzure(sampleService, Year, Category, $scope) {
    azureTestPlan = $scope.plan === undefined || $scope.plan === null ? 'threeyearhybrid' : $scope.plan;
    if (sampleService.IsUserCostSavedStatus === true) {
        if (Category === "Hardware") {
            var Total = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (Category.toLowerCase() === value.Type.toLowerCase())) {
                    Total += value.OnPremise;
                }
                if ((value.Year.search(Year) === 0) && ("hardware maintenance cost" === value.Type.toLowerCase())) {
                    Total += value.OnPremise;
                }

            });
            return Total;
        }
        else if (Category === "Software") {
            if (sampleService.IsUserCostSavedStatus === true) {
                var TotalSavedOnpremise = 0;
                var TotalSavedAzure = 0;
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if ((value.Year.search(Year) === 0) && (value.Type === "Software (Linux)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += $scope.AzureLinuxCost(azureTestPlan);
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += $scope.AzureLinuxCost(azureTestPlan) * 1.05;
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += ($scope.AzureLinuxCost(azureTestPlan)) * 1.1025;
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += ($scope.AzureLinuxCost(azureTestPlan)) * 1.157625;
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += ($scope.AzureLinuxCost(azureTestPlan)) * 1.21550625;
                        }
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Software (Windows)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sql License Cost")) {
                        TotalSavedOnpremise += value.OnPremise;
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += sampleService.tcoType === "postgre" ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0;
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) * 1.05;
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) * 1.1025;
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) * 1.157625;
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreSQLCost(postgreTestPlan) : 0) * 1.21550625;
                        }
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(SQL)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Windows License)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Linux License)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        TotalSavedAzure += 0;
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "BizTalk")) {
                        TotalSavedOnpremise += value.OnPremise;
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += $scope.AzureBiztalkCost(azureTestPlan);
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += ($scope.AzureBiztalkCost(azureTestPlan)) * 1.05;
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += ($scope.AzureBiztalkCost(azureTestPlan)) * 1.1025;
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += ($scope.AzureBiztalkCost(azureTestPlan)) * 1.157625;
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += ($scope.AzureBiztalkCost(azureTestPlan)) * 1.21550625;
                        }
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Oracle License")) {
                        TotalSavedOnpremise += value.OnPremise;
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += Math.round(($scope.TotalAzureOracleCost()) * 100) / 100;
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100);
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100);
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100);
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += (Math.round(($scope.TotalAzureOracleCost()) * 100) / 100);
                        }

                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Sa(Oracle)")) {
                        TotalSavedOnpremise += value.OnPremise;
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100;
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += (Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100) ;
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += (Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100);
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += (Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100);
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += (Math.round((($scope.TotalAzureOracleCost()) * 22 / 100) * 100) / 100);
                        }

                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "DR Cost")) {
                        TotalSavedOnpremise += value.OnPremise;
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100;
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += (Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100) * 1.05;
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += (Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100) * 1.1025;
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += (Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100) * 1.157625;
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += (Math.round(($scope.GetReconLiftandShiftDRStorage()) * 100) / 100) * 1.21550625;
                        }

                    }
                });
                angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                    if ((value.Year.search(Year) === 0) && (value.Type === "Hardware")) {
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += $scope.AzureVmCost(azureTestPlan);
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += ($scope.AzureVmCost(azureTestPlan)) * 1.05;
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += ($scope.AzureVmCost(azureTestPlan)) * 1.1025;
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += ($scope.AzureVmCost(azureTestPlan)) * 1.157625;
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += ($scope.AzureVmCost(azureTestPlan)) * 1.21550625;
                        }
                    }
                    else if ((value.Year.search(Year) === 0) && (value.Type === "Hardware Maintenance Cost")) {
                        if (value.Year == '1 Year') {
                            TotalSavedAzure += sampleService.tcoType === "postgre" ? $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew) : $scope.AzureSqlCost(azureTestPlan);
                        }
                        else if (value.Year == '2 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew) : $scope.AzureSqlCost(azureTestPlan)) * 1.05;
                        }
                        else if (value.Year == '3 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew) : $scope.AzureSqlCost(azureTestPlan)) * 1.1025;
                        }
                        else if (value.Year == '4 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew) : $scope.AzureSqlCost(azureTestPlan)) * 1.157625;
                        }
                        else if (value.Year == '5 Year') {
                            TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzureSqlCostWithBenifit(sampleService.sqlType, sampleService.planNew) : $scope.AzureSqlCost(azureTestPlan)) * 1.21550625;
                        }

                    }
                });
                return Total = TotalSavedOnpremise - (TotalSavedAzure);
            }

        }
        else if ((Category === "Electricity")) {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === 'electricity')) {
                    TotalSavedOnpremise += value.OnPremise;
                    TotalSavedAzure += 0;
                }

            });
            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }
        else if ((Category === "Data Center")) {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === 'data center')) {
                    TotalSavedOnpremise += value.OnPremise;
                    TotalSavedAzure += 0;
                }
            });
            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }

        else if ((Category === "IT Labor")) {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === 'it labor')) {
                    TotalSavedOnpremise += value.OnPremise;
                    if (value.Year == '1 Year') {
                        TotalSavedAzure += Math.round($scope.AzureItLabourCost() * 100) / 100;
                    }
                    else if (value.Year == '2 Year') {
                        TotalSavedAzure += (Math.round($scope.AzureItLabourCost() * 100) / 100) * 1.05;
                    }
                    else if (value.Year == '3 Year') {
                        TotalSavedAzure += (Math.round($scope.AzureItLabourCost() * 100) / 100) * 1.1025;
                    }
                    else if (value.Year == '4 Year') {
                        TotalSavedAzure += (Math.round($scope.AzureItLabourCost() * 100) / 100) * 1.157625;
                    }
                    else if (value.Year == '5 Year') {
                        TotalSavedAzure += (Math.round($scope.AzureItLabourCost() * 100) / 100) * 1.21550625;
                    }

                }
            });
            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }
        else if ((Category === "Storage")) {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === 'storage hardware cost')) {
                    TotalSavedOnpremise += value.OnPremise;
                    if (value.Year == '1 Year') {
                        TotalSavedAzure += sampleService.tcoType === "postgre" ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth();
                    }
                    else if (value.Year == '2 Year') {
                        TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()) * 1.05;
                    }
                    else if (value.Year == '3 Year') {
                        TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()) * 1.1025;
                    }
                    else if (value.Year == '4 Year') {
                        TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()) * 1.157625;
                    }
                    else if (value.Year == '5 Year') {
                        TotalSavedAzure += (sampleService.tcoType === "postgre" ? $scope.AzurePostgreStorageGrowth() : $scope.AzureStorageGrowth()) * 1.21550625;
                    }
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === 'backup and archive cost')) {
                    TotalSavedOnpremise += value.OnPremise;
                    if (value.Year == '1 Year') {
                        TotalSavedAzure += $scope.GetReconLiftandShiftBackupStorage();
                    }
                    else if (value.Year == '2 Year') {
                        TotalSavedAzure += ($scope.GetReconLiftandShiftBackupStorage()) * 1.05;
                    }
                    else if (value.Year == '3 Year') {
                        TotalSavedAzure += ($scope.GetReconLiftandShiftBackupStorage()) * 1.1025;
                    }
                    else if (value.Year == '4 Year') {
                        TotalSavedAzure += ($scope.GetReconLiftandShiftBackupStorage()) * 1.157625;
                    }
                    else if (value.Year == '5 Year') {
                        TotalSavedAzure += ($scope.GetReconLiftandShiftBackupStorage()) * 1.21550625;
                    }
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === 'storage maintenance cost')) {
                    TotalSavedOnpremise += value.OnPremise;
                    TotalSavedAzure += 0;
                }
            });
            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }
        else if (Category === "Networking") {
            var TotalSavedOnpremise = 0;
            var TotalSavedAzure = 0;
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "bandwidth")) {
                    TotalSavedOnpremise += value.OnPremise;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "azure advisor")) {
                    TotalSavedOnpremise += value.OnPremise;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "azure security center")) {
                    TotalSavedOnpremise += value.OnPremise;
                }
            });
            angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
                if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "bandwidth")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "azure advisor")) {
                    TotalSavedAzure += value.Azure;
                }
                //else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "azure security center")) {
                //    TotalSavedAzure += value.Azure;
                //}
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "azure active directory")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "application gateway")) {
                    TotalSavedAzure += value.Azure;
                }
                //else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "backup")) {
                //    TotalSavedAzure += value.Azure;
                //}
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "traffic manager")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "network watcher")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "loadbalancer")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "express route")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "virtual network")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "ip addresses")) {
                    TotalSavedAzure += value.Azure;
                }
                //else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "vpn gateway")) {
                //    TotalSavedAzure += value.Azure;
                //}
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "log analytics")) {
                    TotalSavedAzure += value.Azure;
                }
                else if ((value.Year.search(Year) === 0) && (value.Type.toLowerCase() === "key vault")) {
                    TotalSavedAzure += value.Azure;
                }
            });

            return Total = TotalSavedOnpremise - TotalSavedAzure;
        }
    }
}
function viewMoreDetailFunction(sampleService, $scope) {
    $scope.viewMoreDetailForCategory = [];
    angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
        if (value.Type === "Bandwidth" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "Azure Advisor" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        //else if (value.Type === "Azure Security Center" && value.Year.search('1') === 0) {
        //    $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        //}
        else if (value.Type === "Azure Active Directory" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "Application Gateway" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        //else if (value.Type === "Backup" && value.Year.search('1') === 0) {
        //    $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        //}
        else if (value.Type === "Traffic Manager" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "Network Watcher" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "Loadbalancer" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "Express Route" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "Virtual Network" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "IP Addresses" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        //else if (value.Type === "VPN Gateway" && value.Year.search('1') === 0) {
        //    $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        //}
        else if (value.Type === "Log Analytics" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
        else if (value.Type === "Key Vault" && value.Year.search('1') === 0) {
            $scope.viewMoreDetailForCategory.push({ Type: value.Type, Cost: value.Azure });
        }
    });

    sampleService.viewMoreDetail = $scope.viewMoreDetailForCategory;
}
function GetPriceFromDB(sampleService, type, wh) {
    var Price = 0;
    angular.forEach(sampleService.UserCostSavedInDb, function (value, key) {
        if (wh === 'Onpremise' && value.Type === type && value.Year.search('1') === 0) {
            Price = value.OnPremise;
        }
        else if (wh === 'Azure' && value.Type === type && value.Year.search('1') === 0) {
            Price = value.Azure;
        }
    });
    return Price;
}
var Id;
function bindregiondata(ctrl) {
    Id = ctrl.value;
    $(document).ready(function () {
        $.ajax({
            url: "TCOAnalysis.aspx/getAssumptionprice",
            type: 'post',
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            data: JSON.stringify({ id: Id }),
            async: false,
            success: function (result) {
                $("[id='Hardware_1']").val(result.d[0].Hardware_Year_1);
                $("[id='Hardware_2']").val(result.d[0].Hardware_Year_2);
                $("[id='Hardware_3']").val(result.d[0].Hardware_Year_3);
                $("[id='Hardware_4']").val(result.d[0].Hardware_Year_4);
                $("[id='Hardware_5']").val(result.d[0].Hardware_Year_5);

                $("[id='Hardware Maintenance Cost_1']").val(result.d[0].Hardware_Maintanence_Cost_Year_1_);
                $("[id='Hardware Maintenance Cost_2']").val(result.d[0].Hardware_Maintanence_Cost_Year_2_);
                $("[id='Hardware Maintenance Cost_3']").val(result.d[0].Hardware_Maintanence_Cost_Year_3_);
                $("[id='Hardware Maintenance Cost_4']").val(result.d[0].Hardware_Maintanence_Cost_Year_4_);
                $("[id='Hardware Maintenance Cost_5']").val(result.d[0].Hardware_Maintanence_Cost_Year_5_);

                $("[id='Software (Linux)_1']").val(result.d[0].Software_Linux_Year_1);
                $("[id='Software (Linux)_2']").val(result.d[0].Software_Linux_Year_2);
                $("[id='Software (Linux)_3']").val(result.d[0].Software_Linux_Year_3);
                $("[id='Software (Linux)_4']").val(result.d[0].Software_Linux_Year_4);
                $("[id='Software (Linux)_5']").val(result.d[0].Software_Linux_Year_5);

                $("[id='Software (Windows)_1']").val(result.d[0].Software_Windows_Year_1);
                $("[id='Software (Windows)_2']").val(result.d[0].Software_Windows_Year_2);
                $("[id='Software (Windows)_3']").val(result.d[0].Software_Windows_Year_3);
                $("[id='Software (Windows)_4']").val(result.d[0].Software_Windows_Year_4);
                $("[id='Software (Windows)_5']").val(result.d[0].Software_Windows_Year_5);

                $("[id='Electricity_1']").val(result.d[0].Electricity_Year_1);
                $("[id='Electricity_2']").val(result.d[0].Electricity_Year_2);
                $("[id='Electricity_3']").val(result.d[0].Electricity_Year_3);
                $("[id='Electricity_4']").val(result.d[0].Electricity_Year_4);
                $("[id='Electricity_5']").val(result.d[0].Electricity_Year_5);

                $("[id='Bandwidth_1']").val(result.d[0].Bandwidth_Year_1);
                $("[id='Bandwidth_2']").val(result.d[0].Bandwidth_Year_2);
                $("[id='Bandwidth_3']").val(result.d[0].Bandwidth_Year_3);
                $("[id='Bandwidth_4']").val(result.d[0].Bandwidth_Year_4);
                $("[id='Bandwidth_5']").val(result.d[0].Bandwidth_Year_5);

                $("[id='Azure Advisor_1']").val(result.d[0].Azure_Advisor_Year_1);
                $("[id='Azure Advisor_2']").val(result.d[0].Azure_Advisor_Year_2);
                $("[id='Azure Advisor_3']").val(result.d[0].Azure_Advisor_Year_3);
                $("[id='Azure Advisor_4']").val(result.d[0].Azure_Advisor_Year_4);
                $("[id='Azure Advisor_5']").val(result.d[0].Azure_Advisor_Year_5);

                $("[id='Azure Security Center_1']").val(result.d[0].Azure_Security_Center_Year_1);
                $("[id='Azure Security Center_2']").val(result.d[0].Azure_Security_Center_Year_2);
                $("[id='Azure Security Center_3']").val(result.d[0].Azure_Security_Center_Year_3);
                $("[id='Azure Security Center_4']").val(result.d[0].Azure_Security_Center_Year_4);
                $("[id='Azure Security Center_5']").val(result.d[0].Azure_Security_Center_Year_5);

                $("[id='Storage hardware cost_1']").val(result.d[0].Storage_Year_1);
                $("[id='Storage hardware cost_2']").val(result.d[0].Storage_Year_2);
                $("[id='Storage hardware cost_3']").val(result.d[0].Storage_Year_3);
                $("[id='Storage hardware cost_4']").val(result.d[0].Storage_Year_4);
                $("[id='Storage hardware cost_5']").val(result.d[0].Storage_Year_5);

                $("[id='Backup and Archive cost_1']").val(result.d[0].Backup_Archive_Year_1);
                $("[id='Backup and Archive cost_2']").val(result.d[0].Backup_Archive_Year_2);
                $("[id='Backup and Archive cost_3']").val(result.d[0].Backup_Archive_Year_3);
                $("[id='Backup and Archive cost_4']").val(result.d[0].Backup_Archive_Year_4);
                $("[id='Backup and Archive cost_5']").val(result.d[0].Backup_Archive_Year_5);

                $("[id='Storage Maintenance cost_1']").val(result.d[0].Storage_Maintenance_Year_1);
                $("[id='Storage Maintenance cost_2']").val(result.d[0].Storage_Maintenance_Year_2);
                $("[id='Storage Maintenance cost_3']").val(result.d[0].Storage_Maintenance_Year_3);
                $("[id='Storage Maintenance cost_4']").val(result.d[0].Storage_Maintenance_Year_4);
                $("[id='Storage Maintenance cost_5']").val(result.d[0].Storage_Maintenance_Year_5);

                $("[id='IT Labor_1']").val(result.d[0].It_Labor_Year_1);
                $("[id='IT Labor_2']").val(result.d[0].It_Labor_Year_2);
                $("[id='IT Labor_3']").val(result.d[0].It_Labor_Year_3);
                $("[id='IT Labor_4']").val(result.d[0].It_Labor_Year_4);
                $("[id='IT Labor_5']").val(result.d[0].It_Labor_Year_5);

                $("[id='Virtualization Cost_1']").val(result.d[0].Virtualization_Cost_Year_1);
                $("[id='Virtualization Cost_2']").val(result.d[0].Virtualization_Cost_Year_2);
                $("[id='Virtualization Cost_3']").val(result.d[0].Virtualization_Cost_Year_3);
                $("[id='Virtualization Cost_4']").val(result.d[0].Virtualization_Cost_Year_4);
                $("[id='Virtualization Cost_5']").val(result.d[0].Virtualization_Cost_Year_5);

                $("[id='BizTalk_1']").val(result.d[0].BizTalk_Year_1);
                $("[id='BizTalk_2']").val(result.d[0].BizTalk_Year_2);
                $("[id='BizTalk_3']").val(result.d[0].BizTalk_Year_3);
                $("[id='BizTalk_4']").val(result.d[0].BizTalk_Year_4);
                $("[id='BizTalk_5']").val(result.d[0].BizTalk_Year_5);

                $("[id='Sql License Cost_1']").val(result.d[0].Database_Year_1);
                $("[id='Sql License Cost_2']").val(result.d[0].Database_Year_2);
                $("[id='Sql License Cost_3']").val(result.d[0].Database_Year_3);
                $("[id='Sql License Cost_4']").val(result.d[0].Database_Year_4);
                $("[id='Sql License Cost_5']").val(result.d[0].Database_Year_5);

                $("[id='Sa(SQL)_1']").val(result.d[0].SA_SQL_Year_1);
                $("[id='Sa(SQL)_2']").val(result.d[0].SA_SQL_Year_2);
                $("[id='Sa(SQL)_3']").val(result.d[0].SA_SQL_Year_3);
                $("[id='Sa(SQL)_4']").val(result.d[0].SA_SQL_Year_4);
                $("[id='Sa(SQL)_5']").val(result.d[0].SA_SQL_Year_5);

                $("[id='Sa(Windows License)_1']").val(result.d[0].SA_Windows_License_Year_1);
                $("[id='Sa(Windows License)_2']").val(result.d[0].SA_Windows_License_Year_2);
                $("[id='Sa(Windows License)_3']").val(result.d[0].SA_Windows_License_Year_3);
                $("[id='Sa(Windows License)_4']").val(result.d[0].SA_Windows_License_Year_4);
                $("[id='Sa(Windows License)_5']").val(result.d[0].SA_Windows_License_Year_5);

                $("[id='Oracle License_1']").val(result.d[0].Oracle_License_Year_1);
                $("[id='Oracle License_2']").val(result.d[0].Oracle_License_Year_2);
                $("[id='Oracle License_3']").val(result.d[0].Oracle_License_Year_3);
                $("[id='Oracle License_4']").val(result.d[0].Oracle_License_Year_4);
                $("[id='Oracle License_5']").val(result.d[0].Oracle_License_Year_5);


                $("[id='Data Center_1']").val(result.d[0].Data_Center_Year_1);
                $("[id='Data Center_2']").val(result.d[0].Data_Center_Year_2);
                $("[id='Data Center_3']").val(result.d[0].Data_Center_Year_3);
                $("[id='Data Center_4']").val(result.d[0].Data_Center_Year_4);
                $("[id='Data Center_5']").val(result.d[0].Data_Center_Year_5);

                $("[id='Sa(Linux License)_1']").val(result.d[0].SA_Linux_License_Year_1);
                $("[id='Sa(Linux License)_2']").val(result.d[0].SA_Linux_License_Year_2);
                $("[id='Sa(Linux License)_3']").val(result.d[0].SA_Linux_License_Year_3);
                $("[id='Sa(Linux License)_4']").val(result.d[0].SA_Linux_License_Year_4);
                $("[id='Sa(Linux License)_5']").val(result.d[0].SA_Linux_License_Year_5);

                $("[id='Sa(Oracle)_1']").val(result.d[0].SA_Oracle_Year_1);
                $("[id='Sa(Oracle)_2']").val(result.d[0].SA_Oracle_Year_2);
                $("[id='Sa(Oracle)_3']").val(result.d[0].SA_Oracle_Year_3);
                $("[id='Sa(Oracle)_4']").val(result.d[0].SA_Oracle_Year_4);
                $("[id='Sa(Oracle)_5']").val(result.d[0].SA_Oracle_Year_5);

                $("[id='DR Cost_1']").val(result.d[0].DR_Cost_1);
                $("[id='DR Cost_2']").val(result.d[0].DR_Cost_2);
                $("[id='DR Cost_3']").val(result.d[0].DR_Cost_3);
                $("[id='DR Cost_4']").val(result.d[0].DR_Cost_4);
                $("[id='DR Cost_5']").val(result.d[0].DR_Cost_5);

            },
            error: function (request, error) {
                console.log(arguments);
                alert(request.responseText);
            }
        });
    });
}


