export const DEMO_FORM_URL = 'https://veai.ve.ai/get-ve-ai-demo';

export const CHANGELOG_URL = 'https://veai.ve.ai/portal/changelog';

export const BLOGS_URL = 'https://ve.ai/blogs';

export const LINKEDIN_URL = 'https://www.linkedin.com/company/veai';

export const INSTAGRAM_URL = 'https://www.instagram.com/veaihq';

export const SHARE_AND_EARN_KIT_URL = 'https://veai.ve.ai/portal/affiliate';

export const TWITTER_POST_URL = 'https://x.com/intent/post?text=';

export const REFERRAL_BASE_URL = 'https://ve.ai/referral';

export const PRIVACY_POLICY_URL_DIRECT_DOWNLOAD =
	'https://drive.google.com/uc?export=download&id=1ktST1T5uBCs-LlPvLTKmpVBKe09HhxOj';

export const COOKIE_POLICY_URL =
	'https://drive.google.com/file/d/1O0mu1uW-KZkYfGFy1RgBAzDd55RigIRJ/preview';

export const TERMS_OF_SERVICE_URL =
	'https://drive.google.com/file/d/1eGn06UUp0CnLbBdL-KZDEB9S9dl0PBhJ/preview';

export const PRIVACY_POLICY_URL_PREVIEW =
	'https://drive.google.com/file/d/1ktST1T5uBCs-LlPvLTKmpVBKe09HhxOj/preview';

export const createEmailBody = (referrerDiscount, referralLink) => `
<html>
    <p>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <meta name="x-apple-disable-message-reformatting" />
    </p>
    <div
        style="
            max-width: 600px;
            min-width: 290px;
            margin: auto;
            background-color: #ffffff;
            padding: 16px 24px;
            border-radius: 24px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
        "
    >
        <div style="font-size: 16px; line-height: 1.6; color: #000">
            <h3 style="color: #000">Explore Ve Ai with me,</h3>
            <p>
                Ve.Ai allows you to design stunning forms, proposals, invoices,
                contracts, and more.
            </p>
            <p>
                I am referring you to join ve with me using my referral link and
                get ${referrerDiscount}% discount.
            </p>
            <center>
                <a
                    href="${referralLink}"
                    target="_blank"
                    style="
                        background-color: #2383e2;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        text-decoration: none;
                        display: inline-block;
                        margin: 16px 0;
                    "
                >
                    <strong>Explore Ve.ai</strong>
                </a>
                <br />
            </center>
            <div
                style="
                    font-size: 12px;
                    margin-top: 32px;
                    color: #888;
                    padding-bottom: 16px;
                "
            ></div>
            <div>
                <a
                    href="https://www.ve.ai/verify-user?n=email_footer"
                    style="color: inherit"
                    target="_blank"
                >
                    <img
                        height="14.87px"
                        width="57px"
                        src="https://ap.assets.ve.ai/logo/veaiblack.png"
                        style="display: block; margin-bottom: 8px" />
                </a>
                AI workers who mind your business.
            </div>
        </div>
    </div>
</html>
`;

export const TWEET_TEXT =
	'Ve.Ai allows you to design stunning forms, proposals, invoices, contracts, I am referring you to join ve with me using my referral link and get 20% discount.';
