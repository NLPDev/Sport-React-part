import React, {Component} from 'react'
import ReactDOM from 'react-dom'

const Terms = (props) => (
  <div className={"reveal " + props.userType} id="terms" data-reveal data-animation-in="fade-in slow"
       data-animation-out="fade-out fast" >
    <h1 className="section-heading">Terms & Conditions</h1>
    <button className="close-button" data-close="" aria-label="Close modal" type="button">
      <span aria-hidden="true" className="psr-icons icon-x"></span>
    </button>
    <div>
      <h5><span><i>Effective January 25, 2017</i></span></h5>
      <p><span>PersonalSportRecord.com takes care to respect the privacy of its online users, both visitors and members (collectively, the “Users”). This Privacy Policy describes how PersonalSportRecord.com collects, uses and discloses your information through a variety of digital means. By accessing the PersonalSportRecord.com website, mobile application or other PersonalSportRecord.com product or service (the “PSR Platform”) on any computer, mobile phone, tablet, console or other device (collectively, a “Device”), you agree to this Privacy Policy.</span></p>
      <p><span>You should check the content of this Privacy Policy periodically for changes as PersonalSportRecord.com reserves the right to make such changes, without notice to you. By using the PSR Platform after such changes have been made and posted you agree to accept those changes, whether you have reviewed them or not. If at any time, you do not agree to this Privacy Policy, your sole remedy is to discontinue use of the PSR Platform. Any use or continuation of use of the PSR Platform is deemed to be your acceptance of this Privacy Policy</span></p>
      <p><span>This Privacy Policy is incorporated into, and is subject to, the User Agreement.</span></p>
      <h6><span><b>Collecting Information</b></span></h6>
      <p><span>For the purposes of this Privacy Policy, there are two categories of information provided to PersonalSportRecord.com by Users: personal information and non-personal information.</span></p>
      <h6><span><b>Personal Information</b></span></h6>
      <p><span>“Personal Information” is information about an identifiable individual. It may include:</span></p>
      <ul>
        <li><span>Information you give PersonalSportRecord.com, such as:</span>
          <ul>
            <li><span>Names, genders, dates of birth, addresses, phone numbers and e-mail addresses, physical description, and health, lifestyle, fitness and sport specific information and statistics.</span></li>
            <li>Contact lists, social media information and profile, GPS location information, and activity and performance information.</li>
            <li>Credit card information</li>
          </ul>
        </li>
        <li><span>Information PersonalSportRecord.com collects about you from third parties, such as:</span>
          <ul>
            <li><span>Information from health care professionals</span></li>
            <li>Evaluation tests, summary report and score or grade,</li>
            <li>Ranking, sorting, scoring, and evaluations by approved coaches</li>
          </ul>
        </li>
      </ul>
      <p><span>PersonalSportRecord.com does not knowingly collect or solicit Personal Information from children under the age of 13. All other information is deemed to be non-personal.</span></p>
      <p><span>Personal information is collected by PersonalSportRecord.com only when voluntarily disclosed by the User.</span></p>
      <p><span>In situations where PersonalSportRecord.com requires Personal Information in order to provide you with customized services or where this information is needed to inform you about new features or services, PersonalSportRecord.com will provide notice to you by expressly requesting that such information be provided. The User is never obligated to provide Personal Information. However, some services offered by PersonalSportRecord.com are unavailable unless Personal Information is provided.</span></p>
      <h6><span><b>Using Information</b></span></h6>
      <p><span>PersonalSportRecord.com may use your information to:</span></p>
      <ul>
        <li><span>enhance, customize and personalize your experience of using the PSR Platform and communications and to use the PSR Platform features.</span></li>
        <li>Operate, provide, improve and maintain the PSR Platform, including analysing User behaviour and trends</li>
        <li>Send administrative messages to you about your account or customer service.</li>
      </ul>
      <p><span>PersonalSportRecord.com will not communicate with you about other commercial products, services or for other promotional purposes without your consent.</span></p>
      <h6><span><b>Disclosing Information</b></span></h6>
      <p><span>PersonalSportRecord.com may disclose your Personal Information to third parties such as local, college, university, provincial, state, federal and international sport organizations (“Sport Organizations”) to enable their officials, employees, agents and others to:</span></p>
      <ul>
        <li><span>rank athletes by grade or score as well as sort by name, location, and other demographics</span></li>
        <li><span>drill down for any athlete and see or enter the results for any specific set of drills and skills, or evaluations</span></li>
      </ul>
      <p>&nbsp;</p>
      <button data-close="" className="button expanded theme" onClick={props.onAccept}>I accept</button>
      <p>&nbsp;</p>
    </div>
  </div>
)
export default Terms;
