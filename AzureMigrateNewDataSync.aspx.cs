using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Helper;
using Newtonsoft.Json;
using OfficeOpenXml;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Globalization;
using System.IO;
using System.IO.Packaging;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Web.Script.Serialization;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using UCCloudReconDAL;
using UCCloudReconDTO;
using UCCloudReconDTO.AzureMigrate;
using UCCloudReconService;
using UCMAPService;
using static UCCloudReconDTO.AzureMigrate.AMHVirtualNetworkDTO;

namespace UCCloudRecon
{
    public partial class AzureMigrateNewDataSync : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //HttpContext.Current.Session["uploadpagename"] = Convert.ToString(Request.QueryString["id"]);
                if (Session["UserMID"] == null)
                {
                    Session.Clear();
                    Session.Abandon();
                    Response.Redirect("LoginPopup.aspx");
                }
                if (!IsPostBack)
                {
                    if (Request.UrlReferrer != null)
                        hlnkBack.NavigateUrl = Request.UrlReferrer.ToString();
                    else
                        hlnkBack.NavigateUrl = "AzureMigrateStart.aspx";
                    if (Convert.ToString(Session["IsUserfromAD"]) == "ad")
                    {
                        var userClaims = User.Identity as ClaimsIdentity;
                        if (userClaims.IsAuthenticated)
                        {
                            AmhActivityService objService = new AmhActivityService();
                            string AccessToken = string.Empty;
                            var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                            if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                            {
                                string TenantId = userClaims.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
                                hfTenantId.Value = TenantId;
                                AccessToken=AzureMigrate.GetToken(TenantId);
                            }
                            else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                                AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                            else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                                AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                            BindUserSubscriptions(AccessToken);

                            //string TenantId = userClaims.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
                            //hfTenantId.Value = TenantId;
                            //BindUserSubscriptions(AzureMigrate.GetToken(TenantId));
                        }
                        else
                        {
                            Session.Clear();
                            Session.Abandon();
                            Response.Redirect("LoginPopup.aspx");
                        }

                    }
                    else
                    {
                        string AccessToken = "";
                        AmhActivityService objService = new AmhActivityService();
                        var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                        if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                        {
                            AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                            hfTenantId.Value = ConfigurationManager.AppSettings["AMH:TenantID"];
                        }
                        else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                        {
                            AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                            hfTenantId.Value = objUser.ProjectTenantID;
                        }
                        BindUserSubscriptions(AccessToken);
                    }

                }
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--Page_Load AzureMigrate:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                throw ex;
            }
        }
        public void BindUserSubscriptions(string AccessToken)
        {
            try
            {
                AzurePortalServices azurePortalService = new AzurePortalServices();
                List<SubscriptionDTO> subscriptions = new List<SubscriptionDTO>();
                subscriptions = azurePortalService.GetUserSubscriptions(AccessToken);
                ddlSubscription.DataSource = subscriptions;
                ddlSubscription.DataBind();
                ddlSubscription.DataTextField = "DisplayName";
                ddlSubscription.DataValueField = "Id";
                ddlSubscription.DataBind();
                ddlSubscription.Items.Insert(0, "[Select Subscription]");
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--BindUserSubscriptions:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                throw ex;
            }
        }
        [WebMethod(EnableSession = true)]
        public static List<ResourcegroupDTO> GetSubscriptionResourcegroup(string subscriptionID, string tenantId)
        {
            List<ResourcegroupDTO> resourcegroups = new List<ResourcegroupDTO>();
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                resourcegroups = azurePortalService.GetSubscriptionResourcegroup(subscriptionID, AccessToken);
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetSubscriptionResourcegroup:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                throw ex;
            }
            return resourcegroups;
        }
        [WebMethod(EnableSession = true)]
        public static List<MigrationProjectDTO> GetMigrateProjectName(string subscriptionID, string resourceGroup, string tenantId)
        {
            List<MigrationProjectDTO> projectName = new List<MigrationProjectDTO>();
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                projectName = azurePortalService.GetMigrateProjectName(resourceGroup, subscriptionID, AccessToken);
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetProjectName:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return projectName;
        }
        /// <summary>
        /// Get Assessment Project List
        /// </summary>
        /// <param name="objAzureMigrate"></param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public static List<AssessmentProjectDTO> GetAssessmentProjectName(string subscriptionID, string resourceGroup, string tenantId)
        {
            List<AssessmentProjectDTO> assessmentName = new List<AssessmentProjectDTO>();
            //dynamic projectName;
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                assessmentName = azurePortalService.GetAssessmentProjectName(resourceGroup, subscriptionID, AccessToken);
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetProjectName:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return assessmentName;
        }
        [WebMethod(EnableSession = true)]
        public static List<ApplianceNameProjectDTO> GetAssessmentApplianceName(string subscriptionID, string resourceGroup, string tenantId, string selectedProjectName, string enviromentType)
        {
            List<ApplianceNameProjectDTO> assessmentName = new List<ApplianceNameProjectDTO>();
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                assessmentName = azurePortalService.GetApplianceName(resourceGroup, subscriptionID, AccessToken, selectedProjectName, enviromentType);
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetProjectName:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return assessmentName;
        }
        [WebMethod(EnableSession = true)]
        public static GroupAssesmentDTO GetGroupName(string subscriptionID, string resourceGroup, string tenantId, string assessmentName)
        {
            GroupAssesmentDTO groupName = new GroupAssesmentDTO();
            //dynamic projectName;
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                groupName = azurePortalService.GetGroupName(resourceGroup, subscriptionID, AccessToken, assessmentName);

            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetProjectName:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return groupName;
        }

        [WebMethod(EnableSession = true)]
        public static List<GroupDTO> GetGroupAssessmentName(string subscriptionID, string resourceGroup, string tenantId, string assessmentName)
        {
            List<GroupDTO> groupName = new List<GroupDTO>();
            //dynamic projectName;
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                groupName = azurePortalService.GetGroupAssessmentName(resourceGroup, subscriptionID, AccessToken, assessmentName);

            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetProjectName:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return groupName;
        }

        //SQL Data API
        [WebMethod(EnableSession = true)]
        public static List<AssessmentDTO> GetAssessmentsSummary(string subscriptionID, string resourceGroup, string tenantId, string assessmentName)
        {
            List<AssessmentDTO> assesmentName = new List<AssessmentDTO>();
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                assesmentName = azurePortalService.GetAssessmentsSummary(resourceGroup, subscriptionID, AccessToken, assessmentName);

            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetProjectName:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return assesmentName;
        }
        [WebMethod(EnableSession = true)]
        public static List<AssessmentDTO> GetAssessmentName(string subscriptionID, string resourceGroup, string tenantId, string assessmentName, string groupName)
        {
            List<AssessmentDTO> assessmentlst = new List<AssessmentDTO>();
            //dynamic projectName;
            try
            {
                AmhActivityService objService = new AmhActivityService();
                string AccessToken = string.Empty;
                var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                    AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                AzurePortalServices azurePortalService = new AzurePortalServices();
                assessmentlst = azurePortalService.GetAssessmentName(resourceGroup, subscriptionID, AccessToken, assessmentName, groupName);

            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetProjectName:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return assessmentlst;
        }
        [WebMethod(EnableSession = true)]
        public static List<GroupDTO> GetGroupAssessmentName(string tenantId)
        {
            List<GroupDTO> objGroupLst = new List<GroupDTO>();
            if (HttpContext.Current.Session["AmhID"] != null)
            {
                AmhActivityService objService = new AmhActivityService();
                var objUser = objService.GetAll(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).Where(x => x.ID == Convert.ToInt32(HttpContext.Current.Session["AmhID"])).FirstOrDefault();
                //List<AssessmentProjectDTO> lstAssProject = GetAssessmentProjectName("d8148567-d3f7-4cf0-b082-cf1f6ac4758f", "AMHTest").Where(x => x.AssessmentSolution.Contains("AMHTestProject")).ToList();
                List<AssessmentProjectDTO> lstAssProject = GetAssessmentProjectName(objUser.ProjectSubscriptionID, objUser.ProjectResourceGroup, tenantId).Where(x => x.AssessmentSolution.Contains("AMHTestProject")).ToList();
                if (lstAssProject != null && lstAssProject.Count > 0)
                {
                    objGroupLst = GetGroupAssessmentName(objUser.ProjectSubscriptionID, objUser.ProjectResourceGroup, tenantId, lstAssProject[0].AssessmentSolution).ToList();
                    foreach (var item in objGroupLst)
                    {
                        item.AssessmentSolutionName = lstAssProject[0].AssessmentSolution;
                    }
                }
            }
            return objGroupLst;
        }
        [WebMethod(EnableSession = true)]
        public static AMHStatusDetailsDTO GetAMHStatusDetails(string _DBName)
        {
            AMHStatusDetailsDTO aMH = null;
            try
            {
                AzureMigrateActivityService MapPaaSServiceOb = new AzureMigrateActivityService(Convert.ToString(Helper.SQLHelper.GetServerName()), _DBName);
                aMH = MapPaaSServiceOb.GetAMHStatusDetails();
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--AMHTestingData:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                    Logger.WriteException("AMH", HttpContext.Current.Session["UserEmailID"].ToString(), HttpContext.Current.Session["DBID"].ToString(), HttpContext.Current.Session["DBName"].ToString(), HttpContext.Current.Request.Url.AbsolutePath, System.Reflection.MethodBase.GetCurrentMethod().Name, ex, "Message");

                }
            }
            return aMH;
        }
        [WebMethod(EnableSession = true)]
        public static string ahmAllDataSync(AzureMigrateDisCoverDataDTO objAzureMigrate)
        {
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string AccessToken = String.Empty;
            var responseMessage = new ResponseMessages();
            string response = String.Empty;
            try
            {
                bool licenceAvlable = licenseAvailable();

                if (licenceAvlable)
                {
                    var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                    if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                    else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                    else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--AzureMigrate Assesment Type:" + "Message :" + objAzureMigrate._AssesmentType);
                    }
                    var AssesmentType = objAzureMigrate._AssesmentType.Split(',');
                    var group = objAzureMigrate.group.Split(',');
                    var assessments = objAzureMigrate.assessments.Split(',');
                    int flag = 0;
                    for (int i = 0; i < AssesmentType.Length - 1; i++)
                    {
                        objAzureMigrate._AssesmentType = AssesmentType[i];
                        objAzureMigrate.group = group[i];
                        objAzureMigrate.assessments = assessments[i];
                        if (!(objAzureMigrate._AssesmentType.ToLower().Contains("avs") || objAzureMigrate._AssesmentType.ToLower().Contains("sql")
                            || objAzureMigrate._AssesmentType.ToLower().Contains("app") || objAzureMigrate._AssesmentType.ToLower().Contains("site")))
                        {
                            List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                                    CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, ("vm" + objAzureMigrate._AssesmentType),
                                    objAzureMigrate.enviromentType);
                            if (CheckStatus.Count > 0)
                            {
                                using (StreamWriter writer = new StreamWriter(filePath, true))
                                {
                                    writer.WriteLine("Method:  " + "--Check VM:" + "Message :" + "In This Project VM data Already Sync");
                                }
                            }
                            else
                            {
                                string _status = SyncVMData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                                if (_status == "true")
                                {
                                    flag++;
                                }
                                else
                                {
                                    responseMessage.Message = _status;
                                    var jsonSerialiser123 = new JavaScriptSerializer();
                                    jsonSerialiser123.MaxJsonLength = Int32.MaxValue;
                                    response = jsonSerialiser123.Serialize(responseMessage);
                                    return response;
                                }
                                
                            }
                        }
                        else if (objAzureMigrate._AssesmentType.ToLower().Contains("sql") && !objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                        {
                            List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                                    CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, objAzureMigrate._AssesmentType,
                                    objAzureMigrate.enviromentType);
                            if (CheckStatus.Count > 0)
                            {
                                using (StreamWriter writer = new StreamWriter(filePath, true))
                                {
                                    writer.WriteLine("Method:  " + "--Check SQL :" + "Message :" + "In This Project SQl data Already Sync");
                                }
                            }
                            else
                            {
                                SyncSQLData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                                flag++;
                            }
                        }
                        else if (objAzureMigrate._AssesmentType.ToLower().Contains("webapp") && !objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                        {
                            List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                                 CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, objAzureMigrate._AssesmentType,
                                 objAzureMigrate.enviromentType);
                            if (CheckStatus.Count > 0)
                            {
                                using (StreamWriter writer = new StreamWriter(filePath, true))
                                {
                                    writer.WriteLine("Method:  " + "--Check Web App :" + "Message :" + "In This Project Web App data Already Sync");
                                }
                            }
                            else
                            {
                                SyncwebAppData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                                flag++;
                            }
                        }
                        else if (objAzureMigrate._AssesmentType.ToLower().Contains("avs") && !objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                        {
                            List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                               CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, objAzureMigrate._AssesmentType,
                               objAzureMigrate.enviromentType);
                            if (CheckStatus.Count > 0)
                            {
                                using (StreamWriter writer = new StreamWriter(filePath, true))
                                {
                                    writer.WriteLine("Method:  " + "--Check AVS :" + "Message :" + "In This Project AVS data Already Sync");
                                }
                            }
                            else
                            {
                                    SyncavsData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                                    flag++;
                            }
                        }
                        else if (objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                        {
                            List<AMHProjectMapping> CheckStatus = null;
                            if (objAzureMigrate.assessments == "InstalledSoftware")
                            {
                                CheckStatus = new TestFileMasterService().
                                         CheckedProjectMapping(objAzureMigrate._ProjectName, "Software_Data", objAzureMigrate._AssesmentType,
                                         objAzureMigrate.enviromentType);
                            }
                            else
                            {
                                CheckStatus = new TestFileMasterService().
                                           CheckedProjectMapping(objAzureMigrate._ProjectName, "Dependance_Data", objAzureMigrate._AssesmentType,
                                           objAzureMigrate.enviromentType);
                            }
                            if (CheckStatus.Count > 0)
                            {
                                using (StreamWriter writer = new StreamWriter(filePath, true))
                                {
                                    writer.WriteLine("Method:  " + "--Check Appliance :" + "Message :" + "In This Project Appliance data Already Sync");
                                }
                            }
                            else
                            {
                                FindOperationsStatus(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName, objAzureMigrate.assessments);
                                flag++;
                            }
                        }

                    }
                    if (flag == 0)
                    {
                        responseMessage.IsSuccess = false;
                        responseMessage.Message = "In This Project All Assessment Synced !";
                    }
                    else
                    {
                        responseMessage.IsSuccess = true;
                        responseMessage.Message = "Data Sync Sucessfully";
                    }
                    
                }
                else
                {
                    responseMessage.IsSuccess = false;
                    responseMessage.Message = "You have reached the limit to upload the Inventory files. Contact CloudAtlas support team support@unifycloud.com";                   
                }
                var jsonSerialiser = new JavaScriptSerializer();
                jsonSerialiser.MaxJsonLength = Int32.MaxValue;
                response = jsonSerialiser.Serialize(responseMessage);

                return response;
            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--ahmAllDataSync:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                    Logger.WriteException("AMH", HttpContext.Current.Session["UserEmailID"].ToString(), HttpContext.Current.Session["DBID"].ToString(), HttpContext.Current.Session["DBName"].ToString(), HttpContext.Current.Request.Url.AbsolutePath, System.Reflection.MethodBase.GetCurrentMethod().Name, ex, "Message");

                }
                responseMessage.IsSuccess = false;
                responseMessage.Message = "Exception occurs";
                var jsonSerialiser = new JavaScriptSerializer();
                jsonSerialiser.MaxJsonLength = Int32.MaxValue;
                response = jsonSerialiser.Serialize(responseMessage);
                return response;
            }

        }

        [WebMethod(EnableSession = true)]
        public static string DiscoverNewData(AzureMigrateDisCoverDataDTO objAzureMigrate)
        {
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            var responseMessage = new ResponseMessages();
            string response = String.Empty;
            string AccessToken = String.Empty;
            string dbName = string.Empty;
            try
            {
                bool licenceAvlable = licenseAvailable();

                if (licenceAvlable)
                {
                    var objUser = objService.GetAllSaveAmhUserDetails(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).FirstOrDefault();
                    if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                    else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                    else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                            AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--AzureMigrate Assesment Type:" + "Message :"+ objAzureMigrate._AssesmentType);
                    }
                    int flag = 0;
                    if (!(objAzureMigrate._AssesmentType.ToLower().Contains("avs") || objAzureMigrate._AssesmentType.ToLower().Contains("sql")
                        || objAzureMigrate._AssesmentType.ToLower().Contains("app") || objAzureMigrate._AssesmentType.ToLower().Contains("site")))
                    {
                        List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                            CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, ("vm" + objAzureMigrate._AssesmentType), 
                            objAzureMigrate.enviromentType);
                        if(CheckStatus.Count >0)
                        {
                            responseMessage.IsSuccess = false;
                            responseMessage.Message = "In This Project VM Already Sync";
                            var jsonSerialiserChecked = new JavaScriptSerializer();
                            jsonSerialiserChecked.MaxJsonLength = Int32.MaxValue;
                            response = jsonSerialiserChecked.Serialize(responseMessage);
                            return response;
                        }
                        else
                        {
                            string _status = SyncVMData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                            if (_status == "true")
                            {
                                flag++;
                            }
                            else
                                {
                                responseMessage.Message = _status;
                                var jsonSerialiser123 = new JavaScriptSerializer();
                                jsonSerialiser123.MaxJsonLength = Int32.MaxValue;
                                response = jsonSerialiser123.Serialize(responseMessage);
                                return response;
                            }
                        }
                    }
                    else if (objAzureMigrate._AssesmentType.ToLower().Contains("sql") && !objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                    {
                        List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                               CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, objAzureMigrate._AssesmentType,
                               objAzureMigrate.enviromentType);
                        if (CheckStatus.Count > 0)
                        {
                            responseMessage.IsSuccess = false;
                            responseMessage.Message = "In This Project SQL Already Sync";
                            var jsonSerialiserChecked = new JavaScriptSerializer();
                            jsonSerialiserChecked.MaxJsonLength = Int32.MaxValue;
                            response = jsonSerialiserChecked.Serialize(responseMessage);
                            return response;
                        }
                        else
                        {
                            SyncSQLData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                            flag++;
                        }
                    }
                    else if (objAzureMigrate._AssesmentType.ToLower().Contains("webapp") && !objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                    {
                        List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                                 CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, objAzureMigrate._AssesmentType,
                                 objAzureMigrate.enviromentType);
                        if (CheckStatus.Count > 0)
                        {
                            responseMessage.IsSuccess = false;
                            responseMessage.Message = "In This Project Web App Data Already Sync";
                            var jsonSerialiserChecked = new JavaScriptSerializer();
                            jsonSerialiserChecked.MaxJsonLength = Int32.MaxValue;
                            response = jsonSerialiserChecked.Serialize(responseMessage);
                            return response;
                        }
                        else
                        {
                            SyncwebAppData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                            flag++;
                        }
                    }
                    else if (objAzureMigrate._AssesmentType.ToLower().Contains("avs") && !objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                    {
                        List<AMHProjectMapping> CheckStatus = new TestFileMasterService().
                                 CheckedProjectMapping(objAzureMigrate._ProjectName, objAzureMigrate.assessments, objAzureMigrate._AssesmentType,
                                 objAzureMigrate.enviromentType);
                        if (CheckStatus.Count > 0)
                        {
                            responseMessage.IsSuccess = false;
                            responseMessage.Message = "In This Project AVS Data Already Sync";
                            var jsonSerialiserChecked = new JavaScriptSerializer();
                            jsonSerialiserChecked.MaxJsonLength = Int32.MaxValue;
                            response = jsonSerialiserChecked.Serialize(responseMessage);
                            return response;
                        }
                        else
                        {
                            SyncavsData(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName);
                            flag++;
                        }
                    }
                    else if (objAzureMigrate._AssesmentType.ToLower().Contains("site"))
                    {
                        List<AMHProjectMapping> CheckStatus = null;
                        if (objAzureMigrate.assessments== "InstalledSoftware")
                        {
                            CheckStatus = new TestFileMasterService().
                                     CheckedProjectMapping(objAzureMigrate._ProjectName, "Software_Data", objAzureMigrate._AssesmentType,
                                     objAzureMigrate.enviromentType);
                        }
                        else
                        {
                            CheckStatus = new TestFileMasterService().
                                       CheckedProjectMapping(objAzureMigrate._ProjectName, "Dependance_Data", objAzureMigrate._AssesmentType,
                                       objAzureMigrate.enviromentType);
                        }
                        if (CheckStatus.Count > 0)
                        {
                            responseMessage.IsSuccess = false;
                            responseMessage.Message = "In This Project Appliance data Already Sync";
                            var jsonSerialiserChecked = new JavaScriptSerializer();
                            jsonSerialiserChecked.MaxJsonLength = Int32.MaxValue;
                            response = jsonSerialiserChecked.Serialize(responseMessage);
                            return response;
                        }
                        else
                        {
                            FindOperationsStatus(objAzureMigrate, AccessToken, objAzureMigrate.assessmentProjectName, objAzureMigrate._assessmentsValidation);
                            flag++;
                        }
                    }
                   
                    if (flag == 0)
                    {
                        responseMessage.IsSuccess = false;
                        responseMessage.Message = "Data Discovery Sync Failed!";
                    }
                    else
                    {
                         responseMessage.IsSuccess = true;
                        responseMessage.Message = "Data Discovery Sync Sucessfully";
                    }

                }
                else
                {
                    responseMessage.IsSuccess = false;
                    responseMessage.Message = "You have reached the limit to upload the Inventory files. Contact CloudAtlas support team support@unifycloud.com";
                }

                var jsonSerialiser = new JavaScriptSerializer();
                jsonSerialiser.MaxJsonLength = Int32.MaxValue;
                response = jsonSerialiser.Serialize(responseMessage);

                return response;
            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--DiscoverData:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                    Logger.WriteException("AMH", HttpContext.Current.Session["UserEmailID"].ToString(), HttpContext.Current.Session["DBID"].ToString(), HttpContext.Current.Session["DBName"].ToString(), HttpContext.Current.Request.Url.AbsolutePath, System.Reflection.MethodBase.GetCurrentMethod().Name, ex, "Message");

                }
                responseMessage.IsSuccess = false;
                responseMessage.Message = "Exception occurs";
                var jsonSerialiser = new JavaScriptSerializer();
                jsonSerialiser.MaxJsonLength = Int32.MaxValue;
                response = jsonSerialiser.Serialize(responseMessage);
                return response;
            }
        }
        [WebMethod(EnableSession = true)]
        public static List<AMHProjectMapping> GetSyncDataDetailSummary(string ProjectName)
        {
            List<AMHProjectMapping> AMHProjectDetails = new List<AMHProjectMapping>();
            try
            {
                int UserID = Convert.ToInt32(HttpContext.Current.Session["UserMID"]);
                AMHProjectDetails = new TestFileMasterService().GetAMHProjectMapping(ProjectName, UserID);

            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetSyncDataDetailSummary:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                return null;
            }
            return AMHProjectDetails;
        }
        public static void InsertProjectDetails(AzureMigrateDisCoverDataDTO objDto)
        {
            try
            {
                AmhActivityService objService = new AmhActivityService();
                AmhUserDetailsDTO objSaveObj = new AmhUserDetailsDTO();
                objSaveObj.UserID = Convert.ToInt32(HttpContext.Current.Session["UserMID"]);
                objSaveObj.ProjectSubscriptionID = objDto.subscriptions;
                objSaveObj.ProjectSubscriptionName = objDto.subscriptionsName;
                objSaveObj.ProjectResourceGroup = objDto.resourcegroups;
                objSaveObj.ProjectResourceGroupRegion = objDto.resourcegroupsLocation;
                objSaveObj.AmhProjectName = objDto.migrateProjects;
                objSaveObj.AmhProjectRegion = objDto.migrateProjectsLocation;
                objSaveObj.LoggedinUsing = Convert.ToString(HttpContext.Current.Session["IsUserfromAD"]);
                objSaveObj.ProjectSubscriptionType = "SubscriptionO365";
                objSaveObj.Active = true;
                objSaveObj.ApplianceSetupStatus = true;
                objSaveObj.DiscoveryStatus = true;
                objSaveObj.InventoryStatus = true;
                int amhId = objService.SaveAmhUserDetails(objSaveObj);
                HttpContext.Current.Session["AmhID"] = amhId.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }
        #region EmailSection
        public static void sendEmailAfterFileUpload(bool IsForSuccess, string FailedReason = "")
        {
            try
            {
                string Emailbody = "";
                string EmailID = string.Empty;
                if (HttpContext.Current.Session["UserEmailID"] != null)
                {
                    EmailID = Convert.ToString(HttpContext.Current.Session["UserEmailID"]);
                }
                if (IsForSuccess)
                {
                    Emailbody = EmailID + " has recently successfully Synced Azure Migrate Data on the CloudRecon portal";
                }
                else
                {
                    Emailbody = EmailID + " has recently try to Synced Azure Mirate Data on the CloudRecon portal, But Sync Process process failed due to " + FailedReason;
                }

                bool Flag = SendEmailtoAdmin("Cloud Recon Support Team", EmailID, Emailbody);
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--GetToken:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                throw ex;
            }
        }
        public static bool SendEmailtoAdmin(String Name, string InventoryUserEmailID, string EmailBody)
        {

            bool Flag = false;
            try
            {
                TestFileMasterService ObbjService = new TestFileMasterService();
                List<CloudReconSupport> LstEmailGroup = new List<CloudReconSupport>();
                LstEmailGroup = ObbjService.GetDataofEmilGroup();

                List<CloudReconSupport> CCuser = new List<CloudReconSupport>();
                List<CloudReconSupport> TOuser = new List<CloudReconSupport>();

                CCuser = LstEmailGroup.Where(s => s.IsForCC == true).ToList();
                TOuser = LstEmailGroup.Where(p => p.IsForCC == false).ToList();

                string HostAdd = Convert.ToString("outlook.office365.com");
                string FromEmail = ConfigurationManager.AppSettings["FromEmail"];
                string Password = ConfigurationManager.AppSettings["Emailpwd"];

                string Subject = Convert.ToString("Cloud Recon:New Inventory Uploaded by Email: " + InventoryUserEmailID);
                MailMessage Msg = new MailMessage();

                Msg.From = new MailAddress(FromEmail);
                foreach (var ToEmail in TOuser)
                {
                    Msg.To.Add(ToEmail.EmailID);
                }
                foreach (var ccEmail in CCuser)
                {
                    Msg.CC.Add(ccEmail.EmailID);
                }
                Msg.Subject = Subject;
                Msg.Body = mailbody(Name, InventoryUserEmailID, EmailBody);
                SmtpClient smtp = new SmtpClient("support@unifycloud.com", 587);
                smtp.Host = HostAdd;
                smtp.Credentials = new System.Net.NetworkCredential(FromEmail, Password);
                // smtp.EnableSsl = true;
                smtp.EnableSsl = true;
                smtp.Send(Msg);
                Flag = true;
            }

            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--SendEmailtoAdmin:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                throw ex;
            }
            return Flag;
        }
        public static string mailbody(string Uname, string InventoryUserEmailID, string Emailbody)
        {
            try
            {
                StringBuilder mailBody = new System.Text.StringBuilder();
                mailBody.Append(" " + "Hi" + "," + Environment.NewLine);
                mailBody.Append(Environment.NewLine);
                mailBody.Append(Emailbody + Environment.NewLine);
                mailBody.Append("");
                mailBody.Append(Environment.NewLine);
                mailBody.Append(Environment.NewLine);
                mailBody.Append("Thanks," + Environment.NewLine);
                mailBody.Append("Support Team (Cloud Recon)");
                return mailBody.ToString();
            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--mailbody:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
                throw ex;
            }
        }
        #endregion
        public static void SyncPerformanceData(AzureMigrateDisCoverDataDTO objAzureMigrate, string dbName)
        {
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string AccessToken = String.Empty;
            try
            {
                if (HttpContext.Current.Session["AmhID"] != null)
                {
                    var objUser = objService.GetAll(Convert.ToInt32(HttpContext.Current.Session["UserMID"])).Where(x => x.ID == Convert.ToInt32(HttpContext.Current.Session["AmhID"])).FirstOrDefault();
                    if (objUser.ProjectSubscriptionType == "SubscriptionCR")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionCR();
                    else if (objUser.ProjectSubscriptionType == "SubscriptionO365")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                    else if (objUser.ProjectSubscriptionType == "SubscriptionOther")
                        AccessToken = AzurePortalServices.GetToken_SubscriptionOther(objUser.ProjectAppID, objUser.ProjectClientSecret, objUser.ProjectTenantID);
                }
                else
                {
                    if (Convert.ToString(HttpContext.Current.Session["IsUserfromAD"]) == "ad")
                    {
                        AccessToken = AzureMigrate.GetToken(objAzureMigrate.tenantId);
                    }
                }
                HttpClient clientresgroup = new HttpClient();
                string requestUrlgroup = string.Format("{0}/subscriptions/{1}/resourcegroups/{2}/providers/Microsoft.Migrate/assessmentprojects/{3}/groups/{4}/assessments/{5}/assessedMachines?api-version={6}",
                   ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                   objAzureMigrate.subscriptions,
                   objAzureMigrate.resourcegroups,
                   objAzureMigrate.assessmentProjectName,
                   objAzureMigrate.group,
                   objAzureMigrate.assessments,
                   "2019-10-01");
                HttpRequestMessage requestgroup = new HttpRequestMessage(HttpMethod.Get, requestUrlgroup);
                requestgroup.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                HttpResponseMessage responseresGroup = clientresgroup.SendAsync(requestgroup).Result;
                if (responseresGroup.IsSuccessStatusCode)
                {
                    dynamic string_1 = "";
                    dynamic first = "";
                    dynamic next = "";
                    dynamic final = "";
                    bool isNextLink = false;

                    var responseContentAmhgroup = responseresGroup.Content.ReadAsStringAsync().Result;

                    AzureMigratePerformanceData getSasTokenResult = JsonConvert.DeserializeObject<AzureMigratePerformanceData>(responseContentAmhgroup);
                    Dictionary<List<Value>, object> DicNextLinkValue = new Dictionary<List<Value>, object>();
                    List<Value> lstValue = new List<Value>();
                    lstValue.AddRange(getSasTokenResult.value);
                    object nextLink = getSasTokenResult.nextLink;

                    if (nextLink != null)
                    {
                        var json_Result = new JavaScriptSerializer().Serialize(getSasTokenResult);
                        string_1 = json_Result.Replace("{\"value\":", "");
                        var newTokens = string_1.Split(new string[] { "],\"nextLink\"" }, StringSplitOptions.None);
                        first = newTokens[0];
                        while (nextLink != null)
                        {
                            HttpClient clientresgroupnew = new HttpClient();
                            HttpRequestMessage requestgroupnext = new HttpRequestMessage(HttpMethod.Get, new Uri(nextLink.ToString()));
                            requestgroupnext.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                            HttpResponseMessage responseresGroupnext = clientresgroupnew.SendAsync(requestgroupnext).Result;
                            if (responseresGroup.IsSuccessStatusCode)
                            {
                                var responseContentAmhgroupnext = responseresGroupnext.Content.ReadAsStringAsync().Result;
                                dynamic subscriptionsResultnext = JsonConvert.DeserializeObject(responseContentAmhgroupnext);
                                AzureMigratePerformanceData getSasTokenResultnext = JsonConvert.DeserializeObject<AzureMigratePerformanceData>(responseContentAmhgroupnext);
                                var serializer = new JavaScriptSerializer();



                                serializer.MaxJsonLength = Int32.MaxValue;
                                if (getSasTokenResultnext.value != null)
                                {

                                    nextLink = getSasTokenResultnext.nextLink;
                                    lstValue.AddRange(getSasTokenResultnext.value);

                                    getSasTokenResult.value = lstValue.ToArray();
                                    getSasTokenResult.nextLink = nextLink;
                                    var jsonResult = new JavaScriptSerializer().Serialize(getSasTokenResultnext);
                                    string_1 = "";
                                    string_1 = jsonResult.Replace("{\"value\":[", ",");
                                    string[] qw1 = string_1.Split(new string[] { "],\"nextLink\"" }, StringSplitOptions.None);

                                    next += qw1[0];




                                    Logger.Activity("AMH", "[" + HttpContext.Current.Session["UserMID"] + "], SubscriptionName:" + objAzureMigrate.subscriptionsName + " ,AMH Project data (" + lstValue.Count + " Servers) fetched successfully");

                                }
                            }

                        }
                        final = "{\"value\":" + first + next + "]" + ",\"nextLink\":null}";
                    }
                    else
                    {
                        isNextLink = true;
                    }
                    if (lstValue.Count > 0)
                    {
                        dynamic subscriptionsResult = "";


                        if (isNextLink == true)
                        {
                            var jsonResult = new JavaScriptSerializer().Serialize(getSasTokenResult);
                            subscriptionsResult = JsonConvert.DeserializeObject(jsonResult);
                        }
                        else
                        {
                            subscriptionsResult = JsonConvert.DeserializeObject(final);
                        }

                        //var jsonResult = new JavaScriptSerializer().Serialize(getSasTokenResult);
                        //dynamic subscriptionsResult = JsonConvert.DeserializeObject(jsonResult);



                        if (HttpContext.Current.Session["AmhID"] != null)
                        {
                            //string activityName = "InventoryStatus";
                            //bool result = objService.UpdateAppStatus(Convert.ToInt32(HttpContext.Current.Session["AmhID"]), activityName);
                            bool inventoryCreate = SavePerformanceDataJson(subscriptionsResult, dbName);


                        }
                        else
                        {
                            if (Convert.ToString(HttpContext.Current.Session["IsUserfromAD"]) == "ad")
                            {
                                // InsertProjectDetails(objAzureMigrate);
                                bool inventoryCreate = SavePerformanceDataJson(subscriptionsResult, dbName);
                            }
                        }
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--SyncPerformanceData :" + "Message :Perd Data Sync Sucessfully");
                        }
                    }
                    else
                    {
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--SyncPerformanceData :" + "Message : No Perf data found in project");
                        }

                    }
                }
                else
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--SyncPerformanceData :" + "Message : Failed to sync PerformanceData");
                    }
                }

            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Method:  " + "--Performance:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
            }
        }
        public static bool SavePerformanceDataJson(dynamic jsonResult, string dbName)
        {
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            string AmhId = Convert.ToString(HttpContext.Current.Session["AmhID"]);
            string CheckFilePath = HttpContext.Current.Server.MapPath(@"AzureJSON\" + Convert.ToString(UserID));
            string CheckFilePathAmhId = HttpContext.Current.Server.MapPath(@"AzureJSON\" + Convert.ToString(UserID) + @"\" + AmhId);
            try
            {
                if (System.IO.Directory.Exists(CheckFilePathAmhId) == false)
                {
                    System.IO.DirectoryInfo oDInfo = new DirectoryInfo(CheckFilePath);
                    System.IO.DirectoryInfo amhInfo = new DirectoryInfo(CheckFilePathAmhId);
                    if (oDInfo.Exists != true)
                    {
                        oDInfo.Create();
                        amhInfo.Create();
                    }
                    if (amhInfo.Exists != true)
                    {
                        amhInfo.Create();
                    }
                }
                System.IO.FileInfo fi = new FileInfo(CheckFilePathAmhId + @"\" + "Perf_" + dbName + ".json");
                if (fi.Exists != true)
                {
                    fi.Create().Close();
                }
                string JSONresult = JsonConvert.SerializeObject(jsonResult);
                CheckFilePathAmhId = CheckFilePathAmhId + @"\" + "Perf_" + dbName + ".json";
                using (var tw = new StreamWriter(CheckFilePathAmhId, true))
                {
                    tw.WriteLine(JSONresult.ToString());
                    Logger.Activity("AMH", "[" + HttpContext.Current.Session["UserMID"] + "]  Perf json crested successfully");
                    tw.Close();

                }

            }
            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["ErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Message :" + ex.Message + " DatabaseID=" + "<br/>" + Environment.NewLine + "StackTrace :" + ex.StackTrace +
                       "" + Environment.NewLine + "Date :" + DateTime.Now.ToString());
                    writer.WriteLine(Environment.NewLine + "-----------------------------------------------------------------------------" + Environment.NewLine);
                }
                return false;
            }
            return true;
        }
        public static string UploadInventoryFile(dynamic subscriptionsResult)
        {
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            string AmhId = Convert.ToString(HttpContext.Current.Session["AmhID"]);
            List<TestFileDTO> oTestFileDTOs = new List<TestFileDTO>();
            TestFileMasterService _TestFileMasterService = new TestFileMasterService();
            TestFileMasterService ObbjService = new TestFileMasterService();
            string dbName = "AMHInvetory" + UserID + DateTime.Now.ToString("ddMMyyyyHHmmss");
            HttpContext.Current.Session["DBName"] = dbName;
            string CheckFilePath = HttpContext.Current.Server.MapPath(@"AzureJSON\" + Convert.ToString(UserID));
            string CheckFilePathAmhId = HttpContext.Current.Server.MapPath(@"AzureJSON\" + Convert.ToString(UserID) + @"\" + AmhId);


            //string UserName = Convert.ToString(HttpContext.Current.Session["UserName"]);


            oTestFileDTOs = _TestFileMasterService.GetFileByUser(Convert.ToInt32(UserID)).Where(s => s.IsSharedInvenotry == null || s.IsSharedInvenotry != true).ToList();


            TestFileDTO ObjDto = new TestFileDTO();
            HttpContext.Current.Session["DBName"] = dbName;
            ObjDto.FileName = dbName;
            ObjDto.CreatedDate = DateTime.Now;
            ObjDto.CretedBy = Convert.ToInt32(UserID);
            ObjDto.Path = CheckFilePathAmhId + @"\" + "New_" + dbName + ".json";
            ObjDto.DbName = dbName;
            ObjDto.DumpFileStatus = 0;
            ObjDto.UploadedVia = "Azure Migrate";
            try
            {
                if (System.IO.Directory.Exists(CheckFilePathAmhId) == false)
                {
                    System.IO.DirectoryInfo oDInfo = new DirectoryInfo(CheckFilePath);
                    System.IO.DirectoryInfo amhInfo = new DirectoryInfo(CheckFilePathAmhId);
                    if (oDInfo.Exists != true)
                    {
                        oDInfo.Create();
                        amhInfo.Create();
                    }
                    if (amhInfo.Exists != true)
                    {
                        amhInfo.Create();
                    }


                }
                System.IO.FileInfo fi = new FileInfo(CheckFilePathAmhId + @"\" + "New_" + dbName + ".json");
                if (fi.Exists != true)
                {
                    fi.Create().Close();


                }


                string JSONresult = JsonConvert.SerializeObject(subscriptionsResult);
                CheckFilePathAmhId = CheckFilePathAmhId + @"\" + "New_" + dbName + ".json";
                using (var tw = new StreamWriter(CheckFilePathAmhId, true))
                {
                    tw.WriteLine(JSONresult.ToString());
                    Logger.Activity("AMH", "[" + HttpContext.Current.Session["UserMID"] + "]  json folder created");
                    tw.Close();
                }
                _TestFileMasterService.InsertFIleDetails(ObjDto);



            }



            catch (Exception ex)
            {
                string filePath = ConfigurationManager.AppSettings["ErrorLoggerLocation"];
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("Message :" + ex.Message + " DatabaseID=" + "<br/>" + Environment.NewLine + "StackTrace :" + ex.StackTrace +
                       "" + Environment.NewLine + "Date :" + DateTime.Now.ToString());
                    writer.WriteLine(Environment.NewLine + "-----------------------------------------------------------------------------" + Environment.NewLine);
                }


                return "";
            }



            return dbName;
        }
        private static bool licenseAvailable()
        {
            int AccessMID = 0;
            int UserID = 0;
            if ((HttpContext.Current.Session["UserMID"]) != null)
            {
                UserID = Convert.ToInt32(HttpContext.Current.Session["UserMID"]);
                if (HttpContext.Current.Session["AccessMID"] != null)
                {
                    AccessMID = Convert.ToInt32(HttpContext.Current.Session["AccessMID"]);
                }
            }
            else
            {
                HttpContext.Current.Session.Clear();
                HttpContext.Current.Session.Abandon();
                HttpContext.Current.Response.Redirect("LoginPopup.aspx");
            }
            List<NoOFLicense> ListLicenseDetail = new List<NoOFLicense>();
            TestFileMasterService ObbjService = new TestFileMasterService();
            TestFileMasterService _TestFileMasterService = new TestFileMasterService();
            List<TestFileDTO> oTestFileDTOs = new List<TestFileDTO>();
            int availableLicense = 0;
            bool result = false;
            if (AccessMID == 5 || AccessMID == 2)
            {
                ListLicenseDetail = ObbjService.GetLicenseDataOfUser(Convert.ToInt32(UserID));
                oTestFileDTOs = _TestFileMasterService.GetFileByUser(Convert.ToInt32(UserID)).Where(s => s.IsSharedInvenotry == null || s.IsSharedInvenotry != true).ToList();
                if (ListLicenseDetail.Count > 0 || oTestFileDTOs.Count > 0)
                {
                    availableLicense = Convert.ToInt32(ListLicenseDetail[0].NOOfLicenses - oTestFileDTOs.Count);
                }
                if (availableLicense > 0)
                {
                    result = true;
                }
            }
            else if (AccessMID == 1)
            {
                result = true;
            }
            return result;
        }
        private static int UploadedLicensecount()
        {
            int AccessMID = Convert.ToInt32(HttpContext.Current.Session["AccessMID"]);
            int UserID = Convert.ToInt32(HttpContext.Current.Session["UserMID"]);
            TestFileMasterService ObbjService = new TestFileMasterService();
            List<NoOFLicense> ListLicenseDetail = new List<NoOFLicense>();
            if (HttpContext.Current.Session["AccessMID"] != null)
            {
                AccessMID = Convert.ToInt32(HttpContext.Current.Session["AccessMID"]);
            }
            int assignedLicence = 0;
            UserMasterService _UserMasterService = new UserMasterService();
            List<UserMasterDTO> AllUserListService = new List<UserMasterDTO>();
            if (AccessMID == 2) // login by team member
            {
                ListLicenseDetail = new List<NoOFLicense>();
                ListLicenseDetail = ObbjService.GetLicenseDataOfUser(Convert.ToInt32(UserID)).ToList();
                if (ListLicenseDetail.Count > 0)
                {
                    assignedLicence = Convert.ToInt32(ListLicenseDetail[0].NOOfLicenses);
                }
            }
            else if (AccessMID == 5) // login by Owner
            {
                int ownerLicense = 0;
                ListLicenseDetail = new List<NoOFLicense>();
                ListLicenseDetail = ObbjService.GetLicenseDataOfUser(Convert.ToInt32(UserID)).ToList();
                if (ListLicenseDetail.Count > 0)
                {
                    ownerLicense = Convert.ToInt32(ListLicenseDetail[0].NOOfLicenses);
                }
                AllUserListService = _UserMasterService.AllUserListService().Where(s => s.CreatedBy == UserID && !string.IsNullOrEmpty(s.RoleType) && s.RoleType != "Customer").ToList();
                foreach (var item in AllUserListService)
                {
                    ListLicenseDetail = new List<NoOFLicense>();
                    ListLicenseDetail = ObbjService.GetLicenseDataOfUser(Convert.ToInt32(item.UserMID)).ToList();
                    if (ListLicenseDetail.Count > 0 && (ListLicenseDetail[0].NOOfLicenses != null))
                    {
                        assignedLicence = assignedLicence + Convert.ToInt32(ListLicenseDetail[0].NOOfLicenses);
                    }
                }
                assignedLicence = ownerLicense - assignedLicence;
            }
            else if (AccessMID == 1)
            {
                assignedLicence = 100000;
            }
            return assignedLicence;
        }

        private static void SaveLogafterUploadTemplate(string FileName, int UserID, string DumpFilePath, string dbName ,int NominationID)
        {
            TestFileMasterService _TestFileMasterService = new TestFileMasterService();
            List<TestFileDTO> oTestFileDTOs = new List<TestFileDTO>();
            TestFileMasterService ObbjService = new TestFileMasterService();
            try
            {
                oTestFileDTOs = _TestFileMasterService.GetFileByUser(Convert.ToInt32(UserID)).Where(s => s.IsSharedInvenotry == null || s.IsSharedInvenotry != true).ToList();
                int RemainingLicense = UploadedLicensecount();

                if (oTestFileDTOs.Count() < RemainingLicense)
                {
                    TestFileDTO ObjDto = new TestFileDTO();

                    ObjDto.FileName = FileName;
                    ObjDto.CreatedDate = DateTime.Now;
                    ObjDto.CretedBy = Convert.ToInt32(UserID);
                    ObjDto.Path = DumpFilePath;
                    ObjDto.DbName = dbName;
                    ObjDto.DumpFileStatus = 0;
                    ObjDto.UploadedVia = "Portal";
                    ObjDto.NominationID = NominationID;
                    ObbjService.InsertFIleDetails(ObjDto);
                    sendEmailAfterFileUpload(true, FileName);
                    //ClientScript.RegisterStartupScript(this.GetType(), "Popup", "ShowPopup();", true);
                }
                else
                {
                    string msg = "You have reached the limit to upload the Inventory files.Contact CloudAtlas support team support @unifycloud.com";
                    //ScriptManager.RegisterStartupScript(this, GetType(), "Popup", "successalert('" + msg + "');", true);

                }
            }

            catch (Exception ex)
            {
                Logger.WriteException("", HttpContext.Current.Session["UserEmailID"].ToString(), "N/A", "N/A", HttpContext.Current.Request.Url.AbsolutePath, System.Reflection.MethodBase.GetCurrentMethod().Name, ex, "Message");

            }
        }

        private static void SaveAMHProjectMappingDetails(int UserID, int FileID, string dbName, string ProjectName, string GroupName, string AssessmentName, string AssessmentType,string EnvironmentType)
        {
            TestFileMasterService ObbjService = new TestFileMasterService();
            try
            {
                AMHProjectMappingDTO ObjDto = new AMHProjectMappingDTO();

                ObjDto.UserID = UserID;
                ObjDto.FileID = FileID;
                ObjDto.dbName = dbName;
                ObjDto.ProjectName = ProjectName;
                ObjDto.GroupName = GroupName;
                ObjDto.AssessmentName = AssessmentName;
                ObjDto.AssessmentType = AssessmentType;
                ObjDto.EnvironmentType = EnvironmentType;
                ObbjService.InsertAMHProjectMapping(ObjDto);

            }

            catch (Exception ex)
            {
                Logger.WriteException("", HttpContext.Current.Session["UserEmailID"].ToString(), "N/A", "N/A", HttpContext.Current.Request.Url.AbsolutePath, System.Reflection.MethodBase.GetCurrentMethod().Name, ex, "Message");

            }
        }
        //SQL Data Assesment 
        public static string SyncVMData(AzureMigrateDisCoverDataDTO objAzureMigrate, string AccessToken, string assessmentProjectName)
        {
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            string status = "true";
            try
            {
                HttpClient clientresgroup = new HttpClient();
                string requestUrlgroup = string.Format("{0}/subscriptions/{1}/resourcegroups/{2}/providers/Microsoft.Migrate/assessmentprojects/{3}/groups/{4}/Assessments/{5}/downloadUrl?api-version={6}",
                   ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                   objAzureMigrate.subscriptions,
                   objAzureMigrate.resourcegroups,
                   objAzureMigrate.assessmentProjectName,
                   objAzureMigrate.group,
                   objAzureMigrate.assessments,
                   "2022-02-02-preview");
                HttpRequestMessage requestgroup = new HttpRequestMessage(HttpMethod.Post, requestUrlgroup);
                requestgroup.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                HttpResponseMessage responseresGroup = clientresgroup.SendAsync(requestgroup).Result;
                UserMasterService service = new UserMasterService();
                if (responseresGroup.IsSuccessStatusCode)
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--VMApi :" + "Message : Vm Api Status True Sucesfully.");
                    }
                    List<AMHProjectMapping> TestFileDTOs1 = new TestFileMasterService().GetAMHProjectMapping(objAzureMigrate._ProjectName, Convert.ToInt32(UserID));
                    if (TestFileDTOs1.Count > 0)
                    {
                        var responseContentAmhgroup = responseresGroup.Content.ReadAsStringAsync().Result;
                        AmhSQLDataDTO getSasTokenResult = JsonConvert.DeserializeObject<AmhSQLDataDTO>(responseContentAmhgroup);
                        string _DBName = "Invetory" + UserID + DateTime.Now.ToString("ddMMyyyyHHmmss");
                        string fileName = DateTime.Now.ToString("ddHHmmss") + "VMData.xlsx";
                        string folder = HostingEnvironment.MapPath("~/AMHCSV/" + UserID + "/" + TestFileDTOs1[0].TempDbName + "/" + "VM" + "/");
                        Directory.CreateDirectory(folder);
                        string myPath = folder + fileName;
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--VMDirectory :" + "Message :  Vm Directory Sucesfully Created.");
                        }
                        using (WebClient wc = new WebClient())
                        {
                            wc.DownloadFile(getSasTokenResult.assessmentReportUrl, myPath);
                            using (StreamWriter writer = new StreamWriter(filePath, true))
                            {
                                writer.WriteLine("Method:  " + "--VMData :" + "Message : Csv download Sucesfully.");
                            }
                        }
                        if (TestFileDTOs1.Count > 0)
                        {
                            service.UpdateAzureMigrateOtherFiles(Convert.ToInt32(TestFileDTOs1[0].FileID),  fileName, TestFileDTOs1[0].TempDbName, folder, Convert.ToInt32(UserID), "VM_DATA");
                            using (StreamWriter writer = new StreamWriter(filePath, true))
                            {
                                writer.WriteLine("Method:  " + "--VMData :" + "Message :  Upload data in AzureMigrateOtherFiles Sucesfully.");
                            }
                            SaveAMHProjectMappingDetails(Convert.ToInt32(UserID), Convert.ToInt32(TestFileDTOs1[0].FileID), TestFileDTOs1[0].TempDbName, objAzureMigrate._ProjectName, objAzureMigrate.group, objAzureMigrate.assessments, "vm" + objAzureMigrate._AssesmentType, objAzureMigrate.enviromentType);
                            using (StreamWriter writer = new StreamWriter(filePath, true))
                            {
                                writer.WriteLine("Method:  " + "--VMData :" + "Message :  Upload data in AMHProjectMapping Sucesfully.");
                            }
                        }
                        else
                        {
                            using (StreamWriter writer = new StreamWriter(filePath, true))
                            {
                                status = "VM Data Sync Fail";
                                writer.WriteLine("Method:  " + "--SyncVMData :" + "Message :Failed? Please First upload VM Data");
                            }
                        }
                    }
                    else
                    {
                        var responseContentAmhgroup = responseresGroup.Content.ReadAsStringAsync().Result;
                        AmhSQLDataDTO getSasTokenResult = JsonConvert.DeserializeObject<AmhSQLDataDTO>(responseContentAmhgroup);
                        string dbName = "Invetory" + UserID + DateTime.Now.ToString("ddMMyyyyHHmmss");
                        string fileName = DateTime.Now.ToString("ddHHmmss") + "VMData.xlsx";
                        string folder = HostingEnvironment.MapPath("~/AMHCSV/" + UserID + "/" + dbName + "/" + "VM" + "/");
                        Directory.CreateDirectory(folder);
                       string myPath = folder + fileName;
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--VMDirectory :" + "Message :  Vm Directory Sucesfully Created.");
                        }
                        using (WebClient wc = new WebClient())
                        {
                            wc.DownloadFile(getSasTokenResult.assessmentReportUrl, myPath);
                            using (StreamWriter writer = new StreamWriter(filePath, true))
                            {
                                writer.WriteLine("Method:  " + "--VMData :" + "Message : Csv download Sucesfully.");
                            }
                        }  
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--VMData_Copy :" + "Message : Csv Copy download Sucesfully.");
                        }
                        SaveLogafterUploadTemplate(fileName, Convert.ToInt32(UserID), folder, dbName, Convert.ToInt32(objAzureMigrate.NominationID));
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--VMData :" + "Message :  Upload data in testtable Sucesfully.");
                        }
                        List<TestTable> testtabledata = new TestFileMasterService().GetTestTablesData(dbName, Convert.ToInt32(UserID));
                        SaveAMHProjectMappingDetails(Convert.ToInt32(UserID), Convert.ToInt32(testtabledata[0].FileID), dbName, objAzureMigrate._ProjectName, objAzureMigrate.group, objAzureMigrate.assessments, "vm" + objAzureMigrate._AssesmentType, objAzureMigrate.enviromentType);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--VMData :" + "Message :  Upload data in AMHProjectMapping Sucesfully.");
                        }
                    }

                }
                else
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        string errorMessage123 = "";
                        string errorMessage = responseresGroup.ReasonPhrase;
                        string errorContent = responseresGroup.Content.ReadAsStringAsync().Result;
                        
                        ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(errorContent);
                        if(errorResponse.error.message.ToLower().Contains("disabled"))
                        {
                            errorMessage123 = "The subscription  is disabled and therefore marked as read only.Please re-enabled.";
                        }
                        else if(errorResponse.error.message.ToLower().Contains("authorization"))
                        {
                            errorMessage123 = "The client does not have authorization to perform action or the scope is invalid. please refresh your credentials.";
                        }
                        else
                        {
                            errorMessage123 = errorResponse.error.message;
                        }
                        status = errorMessage123;
                        writer.WriteLine("Method:  " + "--VMApi :" + "Message :"+ errorMessage);
                        writer.WriteLine("Method:  " + "--VMApi :" + "Message :" + errorContent);
                    }
                }

            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    status = "VM Data Sync Fail";
                    writer.WriteLine("Method:  " + "--SyncVMData:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
            }
            return status;
        }
        public static bool SyncSQLData(AzureMigrateDisCoverDataDTO objAzureMigrate, string AccessToken, string assessmentProjectName)
        {
            bool status = true;
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            try
            {
                HttpClient clientresgroup = new HttpClient();
                string requestUrlgroup = string.Format("{0}/subscriptions/{1}/resourcegroups/{2}/providers/Microsoft.Migrate/assessmentprojects/{3}/groups/{4}/sqlAssessments/{5}/downloadUrl?api-version={6}",
                   ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                   objAzureMigrate.subscriptions,
                   objAzureMigrate.resourcegroups,
                   objAzureMigrate.assessmentProjectName,
                   objAzureMigrate.group,
                   objAzureMigrate.assessments,
                   "2022-02-02-preview");
                HttpRequestMessage requestgroup = new HttpRequestMessage(HttpMethod.Post, requestUrlgroup);
                requestgroup.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                HttpResponseMessage responseresGroup = clientresgroup.SendAsync(requestgroup).Result;
                UserMasterService service = new UserMasterService();
                if (responseresGroup.IsSuccessStatusCode)
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--SQLApi :" + "Message : SqlApi Status True Sucesfully.");
                    }
                    var responseContentAmhgroup = responseresGroup.Content.ReadAsStringAsync().Result;
                    AmhSQLDataDTO getSasTokenResult = JsonConvert.DeserializeObject<AmhSQLDataDTO>(responseContentAmhgroup);
                    List<AMHProjectMapping> TestFileDTOs = new TestFileMasterService().GetAMHProjectMapping(objAzureMigrate._ProjectName, Convert.ToInt32(UserID));
                    string _DBName = "Invetory" + UserID + DateTime.Now.ToString("ddMMyyyyHHmmss");
                    string fileName = DateTime.Now.ToString("ddHHmmss") + "SQLData.xlsx";
                    string folder = HostingEnvironment.MapPath("~/AMHCSV/" + UserID + "/" + TestFileDTOs[0].TempDbName + "/" + "SQL" + "/");
                    Directory.CreateDirectory(folder);
                    string myPath = folder + fileName;
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--SQLDirectory :" + "Message : SQLDirectory Created Sucesfully.");
                    }
                    using (WebClient wc = new WebClient())
                    {
                        wc.DownloadFile(getSasTokenResult.assessmentReportUrl, myPath);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--SQLData :" + "Message : Csv download Sucesfully.");
                        }
                    }
                    if (TestFileDTOs.Count > 0)
                    {
                        bool UpdateTable = service.UpdateAzureMigrateOtherFiles(
                           Convert.ToInt32(TestFileDTOs[0].FileID),
                            fileName, TestFileDTOs[0].TempDbName,
                           folder,
                           Convert.ToInt32(UserID), "SQL_DATA");
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--SQLData :" + "Message : Upload Data AzureMigrateOtherFiles Sucesfully.");
                        }
                        SaveAMHProjectMappingDetails(Convert.ToInt32(UserID), Convert.ToInt32(TestFileDTOs[0].FileID), TestFileDTOs[0].TempDbName, objAzureMigrate._ProjectName, objAzureMigrate.group, objAzureMigrate.assessments, objAzureMigrate._AssesmentType, objAzureMigrate.enviromentType);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--SQLData :" + "Message : Upload Data AMHProjectMapping Sucesfully.");
                        }
                    }
                    else
                    {
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            status = false;
                            writer.WriteLine("Method:  " + "--SyncSQLData :" + "Message :Failed? Please First upload VM Data");
                        }
                    }
                }
                else
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        status = false;
                        writer.WriteLine("Method:  " + "--SQLApi :" + "Message : SqlApi Status False Failed.");
                    }
                }

            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    status = false;
                    writer.WriteLine("Method:  " + "--SyncSQLData:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
            }
            return status;
        }
        public static bool SyncwebAppData(AzureMigrateDisCoverDataDTO objAzureMigrate, string AccessToken, string assessmentProjectName)
        {
            bool status = true;
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            try
            {
                HttpClient clientresgroup = new HttpClient();
                string requestUrlgroup = string.Format("{0}/subscriptions/{1}/resourcegroups/{2}/providers/Microsoft.Migrate/assessmentprojects/{3}/groups/{4}/webAppAssessments/{5}/downloadUrl?api-version={6}",
                   ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                   objAzureMigrate.subscriptions,
                   objAzureMigrate.resourcegroups,
                   objAzureMigrate.assessmentProjectName,
                   objAzureMigrate.group,
                   objAzureMigrate.assessments,
                   "2022-02-02-preview");
                HttpRequestMessage requestgroup = new HttpRequestMessage(HttpMethod.Post, requestUrlgroup);
                requestgroup.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                HttpResponseMessage responseresGroup = clientresgroup.SendAsync(requestgroup).Result;
                UserMasterService service = new UserMasterService();
                if (responseresGroup.IsSuccessStatusCode)
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--WebAppApi :" + "Message : WebAppApi Status is True Successfully.");
                    }
                    var responseContentAmhgroup = responseresGroup.Content.ReadAsStringAsync().Result;
                    AmhSQLDataDTO getSasTokenResult = JsonConvert.DeserializeObject<AmhSQLDataDTO>(responseContentAmhgroup);
                    //List<TestFileDTO> TestFileDTOs = new TestFileMasterService().GetFileByDBID(Convert.ToInt32(HttpContext.Current.Session["DBID"]));
                    List<AMHProjectMapping> TestFileDTOs = new TestFileMasterService().GetAMHProjectMapping(objAzureMigrate._ProjectName ,Convert.ToInt32(UserID));
                    string _DBName = "Invetory" + UserID + DateTime.Now.ToString("ddMMyyyyHHmmss");
                    string fileName = DateTime.Now.ToString("ddHHmmss") + "WebAppData.xlsx";
                    string folder = HostingEnvironment.MapPath("~/AMHCSV/" + UserID + "/" + TestFileDTOs[0].TempDbName + "/" + "WebApp" + "/");
                    Directory.CreateDirectory(folder);
                    string myPath = folder + fileName;
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--WebAppDirectory :" + "Message : Directory Created Successfully.");
                    }
                    using (WebClient wc = new WebClient())
                    {
                        wc.DownloadFile(getSasTokenResult.assessmentReportUrl, myPath);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--WebAppData :" + "Message : Csv download Sucesfully.");
                        }
                    }
                    if (TestFileDTOs.Count > 0)
                    {
                        service.UpdateAzureMigrateOtherFiles(Convert.ToInt32(TestFileDTOs[0].FileID), fileName, TestFileDTOs[0].TempDbName, folder, Convert.ToInt32(UserID), "APP_DATA");
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--WebAppData:" + "Message : Upload data AzureMigrateOtherFiles Sucesfully.");
                        }
                        SaveAMHProjectMappingDetails(Convert.ToInt32(UserID), Convert.ToInt32(TestFileDTOs[0].FileID), TestFileDTOs[0].TempDbName, objAzureMigrate._ProjectName, objAzureMigrate.group, objAzureMigrate.assessments, objAzureMigrate._AssesmentType, objAzureMigrate.enviromentType);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--WebAppData:" + "Message : Upload data AMHProjectMapping Sucesfully.");
                        }
                       
                    }
                    else
                    {
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            status = false;
                            writer.WriteLine("Method:  " + "--SyncwebAppData :" + "Message :Failed? Please First upload VM Data");
                        }
                    }
                }
                else
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        status = false;
                        writer.WriteLine("Method:  " + "--WebAppApi :" + "Message : WebApp Api Status is False Failed.");
                    }
                }

            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    status = false;
                    writer.WriteLine("Method:  " + "--SyncwebAppData:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
            }
            return status;
        }
        public static bool SyncavsData(AzureMigrateDisCoverDataDTO objAzureMigrate, string AccessToken, string assessmentProjectName)
        {
            bool status = true;
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            try
            {
                HttpClient clientresgroup = new HttpClient();
                string requestUrlgroup = string.Format("{0}/subscriptions/{1}/resourcegroups/{2}/providers/Microsoft.Migrate/assessmentprojects/{3}/groups/{4}/avsAssessments/{5}/downloadUrl?api-version={6}",
                   ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                   objAzureMigrate.subscriptions,
                   objAzureMigrate.resourcegroups,
                   objAzureMigrate.assessmentProjectName,
                   objAzureMigrate.group,
                   objAzureMigrate.assessments,
                   "2022-02-02-preview");
                HttpRequestMessage requestgroup = new HttpRequestMessage(HttpMethod.Post, requestUrlgroup);
                requestgroup.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                HttpResponseMessage responseresGroup = clientresgroup.SendAsync(requestgroup).Result;
                UserMasterService service = new UserMasterService();
                if (responseresGroup.IsSuccessStatusCode)
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--avsApi :" + "Message : avsApi Status True Sucesfully.");
                    }
                    var responseContentAmhgroup = responseresGroup.Content.ReadAsStringAsync().Result;
                    AmhSQLDataDTO getSasTokenResult = JsonConvert.DeserializeObject<AmhSQLDataDTO>(responseContentAmhgroup);
                    List<AMHProjectMapping> TestFileDTOs = new TestFileMasterService().GetAMHProjectMapping(objAzureMigrate._ProjectName, Convert.ToInt32(UserID));
                    string _DBName = "Invetory" + UserID + DateTime.Now.ToString("ddMMyyyyHHmmss");
                    string fileName = DateTime.Now.ToString("ddHHmmss") + "AVSData.xlsx";
                    string folder = HostingEnvironment.MapPath("~/AMHCSV/" + UserID + "/" + TestFileDTOs[0].TempDbName + "/" + "AVS" + "/");
                    Directory.CreateDirectory(folder);
                    string myPath = folder + fileName;
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + "--avsDirectory :" + "Message : avsDirectory Created Sucesfully.");
                    }
                    using (WebClient wc = new WebClient())
                    {
                        wc.DownloadFile(getSasTokenResult.assessmentReportUrl, myPath);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--avsData :" + "Message : Csv download Sucesfully.");
                        }
                    }
                    if (TestFileDTOs.Count > 0)
                    {
                        service.UpdateAzureMigrateOtherFiles(Convert.ToInt32(TestFileDTOs[0].FileID), fileName, TestFileDTOs[0].TempDbName, folder, Convert.ToInt32(UserID), "AVS_DATA");
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--avsData :" + "Message : Upload data AzureMigrateOtherFiles Sucesfully.");
                        }
                        SaveAMHProjectMappingDetails(Convert.ToInt32(UserID), Convert.ToInt32(TestFileDTOs[0].FileID), TestFileDTOs[0].TempDbName, objAzureMigrate._ProjectName, objAzureMigrate.group, objAzureMigrate.assessments, objAzureMigrate._AssesmentType, objAzureMigrate.enviromentType);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--avsData :" + "Message : Upload data AMHProjectMapping Sucesfully.");
                        }
                    }
                    else
                    {
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            status = false;
                            writer.WriteLine("Method:  " + "--SyncavsData :" + "Message :Failed? Please First upload VM Data");
                        }
                    }
                }
                else
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        status = false;
                        writer.WriteLine("Method:  " + "--avApi :" + "Message : avsApi Status False Failed.");
                    }
                }

            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    status = false;
                    writer.WriteLine("Method:  " + "--SyncavsData:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
            }
            return status;
        }
        public static bool FindOperationsStatus(AzureMigrateDisCoverDataDTO objAzureMigrate, string AccessToken, string assessmentProjectNam, string _assessmentsValidation)
        {
            bool status = true;
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            try
            {
                if (_assessmentsValidation == "InstalledSoftware")
                {
                    HttpClient clientresgroup = new HttpClient();
                    string requestUrlgroup = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.OffAzure/{3}/{4}/exportApplications?api-version={5}",
                       ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                       objAzureMigrate.subscriptions,
                       objAzureMigrate.resourcegroups,
                       objAzureMigrate.enviromentType,
                       objAzureMigrate._AssesmentType,
                       "2020-08-01-preview");
                    HttpRequestMessage requestgroup = new HttpRequestMessage(HttpMethod.Post, requestUrlgroup);
                    requestgroup.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                    HttpResponseMessage responseresGroup = clientresgroup.SendAsync(requestgroup).Result;
                    UserMasterService service = new UserMasterService();
                    if (responseresGroup.IsSuccessStatusCode)
                    {
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--InstalledSoftware_Api :" + "Message : InstalledSoftware_Api Status True Successfully");
                        }
                        var responseContentProject = responseresGroup.Content.ReadAsStringAsync().Result;
                        dynamic resourcegroupResult = JsonConvert.DeserializeObject(responseContentProject);
                        string _Operationsstatus = resourcegroupResult.name.ToString();
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + "--Operationsstatus :" + "Message :" + _Operationsstatus);
                        }
                        if(!SyncInstalledsoftwareData(objAzureMigrate, AccessToken, assessmentProjectNam, _Operationsstatus, "Software_Data"))
                        {
                            status = false;
                        }
                    }
                    else
                    {
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            status = false;
                            writer.WriteLine("Method:  " + "--InstalledSoftware :" + "Message : InstalledSoftware_Api Status False Failed");
                        }
                    }
                }
                else if (_assessmentsValidation == "ApplicationDependency")
                {
                    string ManagementURI = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.OffAzure/{3}/{4}/exportDependencies?api-version={5}",
                       ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                       objAzureMigrate.subscriptions,
                       objAzureMigrate.resourcegroups,
                       objAzureMigrate.enviromentType,
                       objAzureMigrate._AssesmentType,
                       "2020-08-01-preview");
                    AMHBodyTimeDTO requestObj = new AMHBodyTimeDTO();
                    requestObj.endTime = DateTime.Now;  //"2022-11-28T18:30:00.000Z";
                    for (int i = 1; i <= 2; i++)
                    {
                        HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(ManagementURI);
                        request.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + AccessToken);
                        request.Method = "POST";

                        requestObj.startTime = DateTime.Now.AddDays(-30 * i); //"2022-10-29T18:30:00.000Z";                         
                        string json = Newtonsoft.Json.JsonConvert.SerializeObject(
                            requestObj
                        );

                        request.ContentLength = json.Length;
                        request.ContentType = "application/json";
                        using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                        {
                            streamWriter.Write(json);
                            streamWriter.Flush();
                            streamWriter.Close();
                        }
                        Stream strp = request.GetResponse().GetResponseStream();
                        using (StreamReader rd = new StreamReader(strp, System.Text.Encoding.UTF8))
                        {
                            using (StreamWriter writer = new StreamWriter(filePath, true))
                            {
                                writer.WriteLine("Method:  " + "--ApplicationDependency_Api :" + "Message : ApplicationDependency_Api Status True Successfully");
                            }
                            string res = rd.ReadToEnd();
                            dynamic resourcegroupResult = JsonConvert.DeserializeObject(res);
                            string _Operationsstatus = resourcegroupResult.name.ToString();
                            using (StreamWriter writer = new StreamWriter(filePath, true))
                            {
                                writer.WriteLine("Method:  " + "--ApplicationDependency :" + "Message :" + _Operationsstatus);
                            }
                            if(!SyncInstalledsoftwareData(objAzureMigrate, AccessToken, assessmentProjectNam, _Operationsstatus, "Dependance_Data"))
                            {
                                status = false;
                            }
                        }
                        requestObj.endTime = requestObj.startTime;
                        json = string.Empty;
                        request.Abort();
                    }
                }
            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    status = false;
                    writer.WriteLine("Method:  " + "--SyncOfAzureData:" + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
            }
            return status;
        }

        public static bool SyncInstalledsoftwareData(AzureMigrateDisCoverDataDTO objAzureMigrate, string AccessToken, string assessmentProjectNam, string _Operationsstatus, string _assessmentsValidation)
        {
            bool status = true;
            string filePath = ConfigurationManager.AppSettings["AMHErrorLoggerLocation"];
            AmhActivityService objService = new AmhActivityService();
            string UserID = Convert.ToString(HttpContext.Current.Session["UserMID"]);
            System.Threading.Thread.Sleep(30000);
            try
            {
                HttpClient clientresgroup = new HttpClient();
                string requestUrlgroup = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.OffAzure/{3}/{4}/operationsstatus/{5}?api-version={6}",
                   ConfigurationManager.AppSettings["AMH:AzureResourceManagerUrl"],
                   objAzureMigrate.subscriptions,
                   objAzureMigrate.resourcegroups,
                   objAzureMigrate.enviromentType,
                   objAzureMigrate._AssesmentType,
                   _Operationsstatus,
                   "2020-08-01-preview");
                HttpRequestMessage requestgroup = new HttpRequestMessage(HttpMethod.Get, requestUrlgroup);
                requestgroup.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                HttpResponseMessage responseresGroup = clientresgroup.SendAsync(requestgroup).Result;
                UserMasterService service = new UserMasterService();
                if (responseresGroup.IsSuccessStatusCode)
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + _assessmentsValidation + "Message : Api Status True Sucesfully.");
                    }
                    string fileName = "";
                    string fileName1 = "";
                    var responseContentAmhgroup = responseresGroup.Content.ReadAsStringAsync().Result;
                    dynamic resourcegroupResult = JsonConvert.DeserializeObject(responseContentAmhgroup);
                    string _SASUri = LoadSplitSASUriType(resourcegroupResult.properties.ToString());

                    List<AMHProjectMapping> TestFileDTOs = new TestFileMasterService().GetAMHProjectMapping(objAzureMigrate._ProjectName, Convert.ToInt32(UserID));
                    string _DBName = "Invetory" + UserID + DateTime.Now.ToString("ddMMyyyyHHmmss");
                    if (_assessmentsValidation == "Dependance_Data")
                    {
                        fileName = DateTime.Now.ToString("ddHHmmss") + _assessmentsValidation + ".csv";
                        fileName1 = DateTime.Now.ToString("ddHHmmss") + _assessmentsValidation + ".xlsx";
                    }
                    else
                    {
                        fileName = DateTime.Now.ToString("ddHHmmss") + _assessmentsValidation + ".xlsx";
                        fileName1 = DateTime.Now.ToString("ddHHmmss") + _assessmentsValidation + ".xlsx";
                    }
                    string folder = HostingEnvironment.MapPath("~/AMHCSV/" + UserID + "/" + TestFileDTOs[0].TempDbName + "/" + _assessmentsValidation + "/");
                    Directory.CreateDirectory(folder);
                    string myPath = folder + fileName;
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + _assessmentsValidation + "Message : Directory Created Sucesfully.");
                    }
                    using (WebClient wc = new WebClient())
                    {
                        wc.DownloadFile(_SASUri, myPath);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + _assessmentsValidation + "Message : Csv download Sucesfully.");
                        }
                    }

                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        writer.WriteLine("Method:  " + _assessmentsValidation + "Message : Csv Copy download Sucesfully.");
                    }
                    if (TestFileDTOs.Count > 0)
                    {
                        service.UpdateAzureMigrateOtherFiles(Convert.ToInt32(TestFileDTOs[0].FileID),  fileName, TestFileDTOs[0].TempDbName, folder, Convert.ToInt32(UserID), _assessmentsValidation);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + _assessmentsValidation + "Message : Upload AzureMigrateOtherFiles  Sucesfully.");
                        }
                        SaveAMHProjectMappingDetails(Convert.ToInt32(UserID), Convert.ToInt32(TestFileDTOs[0].FileID), TestFileDTOs[0].TempDbName, objAzureMigrate._ProjectName, objAzureMigrate.group, _assessmentsValidation, objAzureMigrate._AssesmentType, objAzureMigrate.enviromentType);
                        using (StreamWriter writer = new StreamWriter(filePath, true))
                        {
                            writer.WriteLine("Method:  " + _assessmentsValidation + "Message : Upload AMHProjectMapping  Sucesfully.");
                        }
                    }
                }
                else
                {
                    using (StreamWriter writer = new StreamWriter(filePath, true))
                    {
                        status = false;
                        writer.WriteLine("Method:  " + _assessmentsValidation + "Message : Api Status False Failed.");
                    }
                }
            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    status = false;
                    writer.WriteLine("Method:  " + _assessmentsValidation + "Message :" + ex.Message + "-------------------StackTrace  :" + ex.StackTrace);
                }
            }
            return status;
        }
        private static string LoadSplitSASUriType(string SASUriType)
        {
            var vals = SASUriType.Split('"');
            if (vals.Count() > 0)
            {
                return vals[6].Replace("\\", "");

            }
            else
            {
                return "";
            }

        }
      
        public static List<Recon_PaaS_ReadinessWebApp> GetTemplatedata(DataTable dt1)
        {
            List<Recon_PaaS_ReadinessWebApp> AppData = new List<Recon_PaaS_ReadinessWebApp>();
            try
            {
                for (int i = 0; i < dt1.Rows.Count; i++)
                {
                    AppData.Add(new Recon_PaaS_ReadinessWebApp
                    {
                        Server_Name = Convert.ToString(dt1.Rows[i]["Machine"]),
                        OSFamily = null,
                        CurrentOperatingSystem = null,
                        OsArchitecture = null,
                        Machine_Type = null,
                        Application_Name = Convert.ToString(dt1.Rows[i]["Web app name"]),
                        Application_Platform = null,
                        Application_Pool = null,
                        Virtual_Directory = null,
                        Physical_Directory = null,
                        Device_Number = null,
                        Status = Convert.ToString(dt1.Rows[i]["Web app readiness"]).Contains("Not Ready") ? "Not Running" : "Running"
                    });
                }

            }
            catch (Exception ex)
            {
                Logger.WriteException("", HttpContext.Current.Session["UserEmailID"].ToString(), HttpContext.Current.Session["DBID"].ToString(), HttpContext.Current.Session["DBName"].ToString(), HttpContext.Current.Request.Url.AbsolutePath, System.Reflection.MethodBase.GetCurrentMethod().Name, ex, "Message");
            }

            return AppData;
        }

        [WebMethod(EnableSession = true)]
        public static List<UCCloudReconDTO.UserInfo> GetAzureMigrateAccountsDetails()
        {

            try
            {
                ProvisionSystemService obj = new ProvisionSystemService();
                List<AccountsDetailsDTO> detailList = obj.GetNominationDetails(Convert.ToString(HttpContext.Current.Session["UserEmailID"]), "UploadAzureMigrate");
                List<UCCloudReconDTO.UserInfo> list = new List<UCCloudReconDTO.UserInfo>();

                foreach (var item in detailList[0].UserInfos)
                {
                    UCCloudReconDTO.UserInfo objnew = new UCCloudReconDTO.UserInfo();
                    objnew.accountID = item.accountID;
                    objnew.nominationID = item.nominationID;
                    objnew.accountName = item.accountName;
                    objnew.customerName = item.customerName;
                    objnew.TPID = item.TPID;
                    objnew.opportunityID = item.opportunityID;
                    list.Add(objnew);
                }
                return list;
            }
            catch (Exception ex)
            {
                Logger.WriteException("", HttpContext.Current.Session["UserEmailID"].ToString(), "N/A", "N/A", HttpContext.Current.Request.Url.AbsolutePath, System.Reflection.MethodBase.GetCurrentMethod().Name, ex, "Message");

                return null;
            }
        }
    }
    public class AMHBodyTimeDTO
    {
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
    }
    public class ErrorResponse
    {
        public ErrorDetails error { get; set; }
    }
    public class ErrorDetails
    {
        public string code { get; set; }
        public string message { get; set; }
    }
}
