﻿using Base32;
using CMS.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using OtpSharp;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace CMS.Controllers
{
    [Authorize]
    public class ManageController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public ManageController()
        {
        }

        public ManageController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Manage/Index
        public async Task<ActionResult> Index(ManageMessageId? message)
        {
            ViewBag.StatusMessage =
                message == ManageMessageId.ChangePasswordSuccess ? "Mật khẩu đã được thay đổi."
                : message == ManageMessageId.SetPasswordSuccess ? "Mật khẩu đã được thiết lập."
                : message == ManageMessageId.SetTwoFactorSuccess ? "Bảo mật 2 lớp đã được thiết lập."
                : message == ManageMessageId.Error ? "Xảy ra lỗi."
                : message == ManageMessageId.AddPhoneSuccess ? "Số điện thoại đã được thêm."
                : message == ManageMessageId.RemovePhoneSuccess ? "Số điện thoại đã được hủy."
                : "";

            var userId = User.Identity.GetUserId();
            var user = await UserManager.FindByIdAsync(userId);

            var model = new IndexViewModel
            {
                HasPassword = HasPassword(),
                PhoneNumber = user.PhoneNumber,
                TwoFactor = user.TwoFactorEnabled,
                Logins = await UserManager.GetLoginsAsync(userId),
                BrowserRemembered = await AuthenticationManager.TwoFactorBrowserRememberedAsync(userId),
                IsGoogleAuthenticatorEnabled = user.IsGoogleAuthenticatorEnabled
            };

            return View(model);
        }

     

      

        // POST: /Manage/EnableTwoFactorAuthentication
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> EnableTwoFactorAuthentication()
        {
            await UserManager.SetTwoFactorEnabledAsync(User.Identity.GetUserId(), true);
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
            }
            return RedirectToAction("Index", "Manage");
        }

        // POST: /Manage/DisableTwoFactorAuthentication
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DisableTwoFactorAuthentication()
        {
            await UserManager.SetTwoFactorEnabledAsync(User.Identity.GetUserId(), false);
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
            }
            return RedirectToAction("Index", "Manage");
        }

      

        // GET: /Manage/ChangePassword
        public ActionResult ChangePassword()
        {
            return View();
        }

        // POST: /Manage/ChangePassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                if (user != null)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                }
                return RedirectToAction("Index", new { Message = ManageMessageId.ChangePasswordSuccess });
            }
            AddErrors(result);
            return View(model);
        }

        //
        // GET: /Manage/SetPassword
        public ActionResult SetPassword()
        {
            return View();
        }

        //
        // POST: /Manage/SetPassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SetPassword(SetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
                if (result.Succeeded)
                {
                    var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                    if (user != null)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    }
                    return RedirectToAction("Index", new { Message = ManageMessageId.SetPasswordSuccess });
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }




        public async Task<ActionResult> DisableGoogleAuthenticator()
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                user.IsGoogleAuthenticatorEnabled = false;
                user.GoogleAuthenticatorSecretKey = null;
                user.TwoFactorEnabled = false;

                await UserManager.UpdateAsync(user);
            }
            return RedirectToAction("Index", "Manage");
        }

        [HttpGet]
        public ActionResult EnableGoogleAuthenticator()
        {
            byte[] secretKey = KeyGeneration.GenerateRandomKey(20);
            string userName = User.Identity.GetUserName();
            string issuer = "Website Bất động sản Hải Dương";
            string issuerEncoded = HttpUtility.UrlEncode(issuer);
            string barcodeUrl = KeyUrl.GetTotpUrl(secretKey, userName) + "&issuer=" + issuerEncoded;

            var model = new GoogleAuthenticatorViewModel
            {
                SecretKey = Base32Encoder.Encode(secretKey),
                BarcodeUrl = barcodeUrl
            };

            return View(model);
        }


        [HttpPost]
        public async Task<ActionResult> EnableGoogleAuthenticator(GoogleAuthenticatorViewModel model)
        {
            if (ModelState.IsValid)
            {
                byte[] secretKey = Base32Encoder.Decode(model.SecretKey);

                long timeStepMatched = 0;
                var otp = new Totp(secretKey);
                if (otp.VerifyTotp(model.Code.Trim(), out timeStepMatched, new VerificationWindow(2, 2)))
                {
                    var user = UserManager.FindById(User.Identity.GetUserId());
                    user.IsGoogleAuthenticatorEnabled = true;
                    user.GoogleAuthenticatorSecretKey = model.SecretKey;
                    user.TwoFactorEnabled = true;
                    await UserManager.UpdateAsync(user);

                    return RedirectToAction("Index", "Manage");
                }
                else
                {
                    ModelState.AddModelError("Code", "Mã kích hoạt không đúng");
                }
            }

            return View(model);



        }

#region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        private bool HasPhoneNumber()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PhoneNumber != null;
            }
            return false;
        }

        public enum ManageMessageId
        {
            AddPhoneSuccess,
            ChangePasswordSuccess,
            SetTwoFactorSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            RemovePhoneSuccess,
            Error
        }

#endregion
    }

    public class GoogleAuthenticatorViewModel
    {
        public string SecretKey { get; set; }
        public string BarcodeUrl { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập Mã kích hoạt")]
        public string Code { get; set; }    
    }
}