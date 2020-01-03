import React, { FC } from "react";
import { Button } from "antd";

import "./index.scss";

type P = {
  onOk?(checked);
  onCancel?();
};

const Agreement: FC<P> = props => {
  return (
    <div className="developer-agreement">
      <div className="developer-agreement-warp">
        <h4>首部及导言</h4>
        <p>欢迎您使用喜马拉雅开放平台提供的服务！</p>
        <p>
          为使用喜马拉雅开放平台服务（以下简称：本服务），您应当阅读并遵守《喜马拉雅开放平台开发者协议》（以下简称:本协议）。
        </p>
        <p>
          请您务必审慎阅读、充分理解各条款内容，特别是承诺与保证条款、免除或者限制责任的条款，以及开通或使用某项服务的单独协议、规则。
          除非您已阅读、理解并接受本协议及相关协议、规则等所有条款，否则，您无权使用喜马拉雅提供的本服务。您使用本服务，即视为您已阅读并同意上述协议、规则等的约束。您有违反本协议的任何行为时，喜马拉雅有权依照违反情况，随时单方限制、中止或终止向您提供本服务，并有权追究您的相关责任。
        </p>
        <h4>喜马拉雅、开发者均同意和理解：</h4>
        <ul>
          <li>
            （1）开放平台是一个中立的平台服务提供者，本协议项下仅向开发者提供开发服务开放接口或相关中立的技术支持服务，并且喜马拉雅有权基于喜马拉雅网的有序运营、健康发展等因素选择使用本服务的开发者。
          </li>
          <li>
            （2）开发者的应用由开发者以其自身名义开发或享有合法的运营权利，并独立承担全部责任。喜马拉雅不会、也不可能参与开发者应用的研发、运营等任何活动，喜马拉雅也不会对开发者的应用进行任何的修改、编辑或整理等；
          </li>
          <li>
            （3）因开发者应用及服务产生的任何纠纷、责任等，以及开发者违反相关法律法规或本协议约定引发的任何后果，均由开发者独立承担责任、赔偿损失，与喜马拉雅无关。如侵害到喜马拉雅或他人权益的，开发者须自行承担全部责任和赔偿一切损失。
          </li>
          <li>（4）喜马拉雅拥有合作产品输出内容100%商业开发权及广告收益权。</li>
        </ul>
        <h5>1. 术语含义 </h5>
        <p>如无特别说明，下列术语在本协议中的含义为：</p>
        <ul>
          <li>
            1.1
            开发者，指经有效申请并经过上海喜马拉雅科技有限公司同意，将其开发的各种应用接入基于喜马拉雅开放平台而向用户提供各种服务的，具备民事行为能力的个人、法人或其他组织。如无特别说明，也简称为“您”。
          </li>
          <li>
            1.2
            应用，指由开发者以其自身名义开发、创作，享有合法的运营权利，并进行运营和独立承担法律责任的，使用喜马拉雅开放平台服务的应用程序及相关服务
          </li>
          <li>
            1.3
            喜马拉雅开放平台，指由喜马拉雅所拥有、控制、经营的https://open.ximalaya.com网站及前述各平台网站的下属子页面，以下也简称为“开放平台”、“平台”。
          </li>
          <li>
            1.4
            用户数据，是指用户在开放平台、应用等中产生的与用户相关的数据，包括但不限于用户提交的语音数据、图像数据、用户操作行为形成的数据等。“用户数据”的所有权及其他相关权利属于喜马拉雅，且是喜马拉雅的商业秘密，依法属于用户享有的相关权利除外。
          </li>
          <li>
            1.5
            平台运营数据，是指用户、开发者在使用开放平台服务中产生的相关数据，包括但不限于用户或开发者提交的数据、操作行为形成的数据及各类交易数据等。“开放平台运营数据”的所有权及其他相关权利属于喜马拉雅，且是喜马拉雅的商业秘密，依法属于用户享有的相关权利除外。
          </li>
        </ul>
        <h5> 2. 开发者的权利和义务</h5>
        <ul>
          <li>2.1 帐户注册</li>
          <li>
            2.1.1
            您应当通过登录开放平台网站或喜马拉雅其他指定途径，注册喜马拉雅帐户（下简称：帐户）以成为开发者，喜马拉雅帐户一经注册成功，注册时所提供的身份证认证信息（如营业执照、身份证信息等）不得变更，且该帐户不可转让、不可赠与、不可继承等。
          </li>
          <li>
            2.1.2
            您注册帐号时，应提供合法、真实、有效的注册信息，并遵守相关协议、规则等的约束。
          </li>
          <li>
            2.1.3
            为保障本服务的合法性及安全性，您不得违反本协议约定将您的帐号用于其他目的，包括但不限于使用您的帐号为第三方应用申请本服务等。否则，喜马拉雅有权随时单方限制、中止或终止向您及/或您所登记的应用提供本服务，且未经喜马拉雅同意您及/或您所登记的应用不得再次使用本服务。
          </li>
          <li>
            2.1.4
            您注册帐号，是您登录及使用本服务的凭证。您应当做好对该用户名、密码等的保密措施。因您保密措施不当或您的其他行为，致使上述用户名、密码等丢失或泄漏所引起的一切损失和后果，均由您自行承担。
          </li>
          <li>
            2.1.5
            您保证：通过前述用户名及密码在本服务中进行的包括但不限于以下事项：提交相应资质材料、确认和同意相关协议和规则、选择具体服务类别以及进行费用结算等事项，均是您自行或您授权他人进行的行为，对您均有约束力。同时，您承担以前述用户名及密码为标识进行的全部行为的法律责任。
          </li>
          <li>
            2.1.6
            若您发现有他人冒用或盗用您的帐户及密码、或任何其他未经您合法授权的情形时，应立即以有效方式通知喜马拉雅（包括但不限于提供您的身份信息和相关身份资料、相关事实情况及您的要求等）。喜马拉雅收到您的有效请求并核实身份后，会根据不同情况采取相应措施。若您提供的信息不完全，导致喜马拉雅无法核实您的身份或喜马拉雅无法判断您的需求等，而导致喜马拉雅无法进行及时处理，给您带来的损失，您应自行承担。同时，喜马拉雅对您的请求采取措施需要合理期限，对于您通知喜马拉雅以及喜马拉雅根据您的有效通知采取措施之前，由于他人行为给您造成的损失，喜马拉雅不承担任何责任。
          </li>
          <li>
            2.1.7
            您理解并同意，为保护您及用户的数据安全，防止用户信息泄露、毁损、篡改或者丢失，喜马拉雅有权对您接入的信息系统实行接入审查，包括但不限于技术水平审查、安全水平审查、主体资质审查等，并根据审查结果向您提出防入侵、防病毒等措施建议。若您的信息系统仍无法符合保护用户数据安全的要求，喜马拉雅有权拒绝或终止提供本服务。
          </li>
          <li>2.2 资质材料</li>
          <li>
            2.2.1
            您保证：您如实填写和提交帐号注册与开发者认证资料，并对资料的真实性、合法性、准确性和有效性承担责任；您具备使用本服务、接入和运营应用或提供相关服务等行为的相关合法资质或经过了相关政府部门的审核批准；您提供的主体资质材料、相关资质或证明以及其他任何文件等信息真实、准确、完整，并在信息发生变更后，及时进行更新；您具备履行本协议项下之义务、各种行为的能力；您履行相关义务、从事相关行为不违反任何对您的有约束力的法律文件。否则，喜马拉雅有权拒绝或终止提供本服务，并依照本协议对违规帐号进行处罚，且您应不使用喜马拉雅提供的相关服务，且应独自承担由此带来的一切责任及给第三方、喜马拉雅造成的全部损失。
          </li>
          <li>
            2.2.2
            您保证：您会依法及按照喜马拉雅要求提交使用本服务所必须的真实、准确的经过您签章确认的主体资质材料以及联系人姓名（名称）、地址、电子邮箱等相关资料。
          </li>
          <li>
            2.2.3
            您保证：您在开放平台上通过您的应用提供的各种服务，依法已经具有相关的合法资质或获得了有关部门的许可或批准，并可根据喜马拉雅的要求随时提交相关资质或证明文件。
          </li>
          <li>
            2.2.4
            您保证：您在开放平台上通过您的应用提供的各种服务，符合国家相关法规的规定，不违反任何相关法规及相关协议、规则，也不会侵犯任何人的合法权益，同时，会依法、依约或按照喜马拉雅的要求提供版权、专利权等相关证明文件。
          </li>
          <li>2.3 内容集成 </li>
          <li>
            2.3.1
            在使用喜马拉雅接口服务时，您必须通过喜马拉雅开放平台SDK中的播放器或喜马拉雅公司提供的H5链接实现音频播放功能，
            否则视为您严重违约，喜马拉雅公司有权单方解除本协议。您应按照开放平台规定的方式获取喜马拉雅的内容，需同时接入开放平台提供的数据接口逻辑和播放器逻辑，确保正确上传播放数据。并将该内容植入到合作产品及在合作产品中进行展示。
          </li>
          <li>
            2.3.2
            您通过开放平台接口获得的内容，仅能按照该协议约定的方式使用。在播放音频内容时，不得进行任何删减、改编，
            需包含有喜马拉雅公司输出的口播内容及声音商业标志。
          </li>
          <li>
            2.3.3
            您应在合作产品外包装、说明书、对外宣传资料上的明显位置展示喜马拉雅品牌或商业标识，具体展现方式需经喜马拉雅确认。
            喜马拉雅品牌及商业标识是指喜马拉雅及其关联公司拥有的商标、喜马拉雅商业标识“听”或喜马拉雅告知您的其他商业标识。
          </li>
          <li>
            2.3.4
            您需在合作产品集成位置展示喜马拉雅品牌，具体展现的集成位置需经喜马拉雅书面确认。您在合作产品使用喜马拉雅的音频内容时，需标注该音频内容来自于喜马拉雅，具体的标注方式需经喜马拉雅确认。并应引导用户下载“喜马拉雅FM”移动客户端，引导方式包括但不限于新手引导捆绑、升级捆绑、下载引导或其他有效的引导方式。
          </li>
          <li>
            2.3.5
            您需要在应用或产品上线投入市场前，至少提前20个工作日通知到开放平台。由开放平台检测是否正确集成了数据接口逻辑和播放器逻辑、是否正确上传播放数据。
          </li>
          <li>
            2.3.6
            您需要在应用或产品上线或上市后3个工作日内通知到开放平台，形式不限。由开放平台检测是否正确集成了数据接口逻辑及播放器逻辑、是否正确上传播放数据。
          </li>
          <li>
            2.3.7
            您承诺并保证，喜马拉雅是您唯一集成的非音乐类音频内容、不在任意应用中使用任何第三方音频内容。您承诺并保证，本协议签署前您的应用未接入任何除音乐外的音频内容且未涉及除音乐外的其他任何音频业务，您在使用喜马拉雅接口服务期间该等应用也不会接入任何除音乐外及喜马拉雅提供的内容外的其他音频内容或涉及除音乐外的其他音频业务。您确认，本条之约定为双方开展本次合作的前提；若您在使用喜马拉雅接口服务期间拟接入其他音频内容的或开展其他音频业务的，需至少提前6个月书面通知喜马拉雅公司，喜马拉雅公司届时有权单方决定是否终止本协议合作。若您未及时通知喜马拉雅公司的，喜马拉公司在发现后有权立即单方解除本协议，终止全部内容服务，且不视为违约。
          </li>
          <li>
            2.3.8
            未经喜马拉雅书面同意，不得将喜马拉雅的任何内容许可或接口服务授权或提供给任何第三方使用，
            或超出您在申请服务时所申请的应用范围。
          </li>
          <li>
            2.3.9
            在使用喜马拉雅提供的内容（包括音频数据文件、音频播放地址及音频下载地址）时，不得在您的服务器上进行存储、缓存等镜像行为。
          </li>
          <li>
            2.3.10
            无论因何种原因，导致本协议终止，您应立即停止使用喜马拉雅开放平台服务及商标、商号、企业名称等一切商业标识。
          </li>
          <li> 2.4 应用要求 </li>
          <li>
            2.4.1
            您应自行负责您应用的创作、开发、编辑、加工、修改、测试、运营及维护等工作，并且自行承担相应的费用。
          </li>
          <li>
            2.4.2
            您的应用，应符合相关法规、技术规范或标准等，同时，还应符合开放平台的对接入应用在技术、安全等方面的统一要求，以确保应用可以在开放平台安全、稳定的运营。
          </li>
          <li>
            2.4.3
            您应用对本服务相关的API/H5的使用，不得进行任何形式的更改。您应在应用中正确、完整地标注“
            <strong>Powered by 喜马拉雅开放平台</strong>”或“
            <strong>技术由喜马拉雅开放平台提供</strong>
            ”的字样。否则喜马拉雅有权随时中止或终止向您提供本服务。
          </li>
          <li>
            2.4.4
            您的应用在开放平台上运营期间，您需向用户提供及时有效的客户服务，客户服务形式包括但不限于通过明确且合理的方式告知用户客户服务渠道、提供电话、邮箱等，并自行承担客服费用。
          </li>
          <li>
            2.4.5
            您应当在应用中向相关权利人提供投诉途径，确保权利人在认为您侵犯其合法权益时可以向您主张权利。
          </li>
          <li>
            2.4.6
            您的申请使用本服务的应用应为自身开发、创作或获得合法授权运营并独立承担法律责任的应用，您不得通过您的帐号为任何第三方应用代为申请、使用本服务，否则，喜马拉雅有权随时单方限制、中止或终止向您及/或您所登记的应用提供本服务，且未经喜马拉雅同意您及/或您所登记的应用不得再次使用本服务。
          </li>
          <li>
            2.4.7
            为保障用户对应用进行正确的识别、辨别和区分，保障用户的知情权、选择权以及第三方的合法权益，您的应用名称应当与您的应用存在关联性，不得以任何形式侵犯他人合法权益，且每一个应用只能使用一个应用名称。
          </li>
          <li> 2.5 应用运营 </li>
          <li>
            2.5.1
            您应自行按照相关法规，运营您的应用，履行相关义务，并自行承担全部责任，包括但不限于：
            （1）依照相关法律法规的规定，保留相应的访问、使用等日志记录；
            （2）国家有权机关向您依法查询相关信息时，应积极配合提供；
            （3）主动履行其他您依法应履行的义务。
          </li>
          <li>
            2.5.2 您保证：
            （1）您的应用、提供给用户的相关服务及发布的相关信息、内容等，不违反相关法律、法规、政策等的规定及本协议或相关协议、规则等，也不会侵犯任何人的合法权益；
            （2）您自行对您应用中由用户使用应用服务产生的内容（包括但不限于留言、消息、评论、名称等）负责，保证其不违反相关法律、法规、政策的规定以及公序良俗等。否则，您应及时采取删除、断开连接或其他有效措施；
            （3）应用设计上应当重视用户体验，尊重用户知情权、选择权，应用服务应当坚持诚信原则，不误导、欺诈、混淆用户，尊重用户的隐私，不骚扰用户，不制造垃圾信息。
          </li>
          <li>
            2.5.3
            您不得从事任何包括但不限于以下的违反法规的行为，也不得为以下违反法规的行为提供便利（包括但不限于为您应用的用户的行为提供便利等）：
            （1）反对宪法所确定的基本原则的行为；
            （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的行为；
            （3）损害国家荣誉和利益的行为；
            （4）煽动民族仇恨、民族歧视，破坏民族团结的行为；
            （5）破坏国家宗教政策，宣扬邪教和封建迷信的行为；
            （6）散布谣言，扰乱社会秩序，破坏社会稳定的行为；
            （7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的行为；
            （8）侮辱或者诽谤他人，侵害他人合法权益的行为；
            （9）侵害他人知识产权、商业秘密等合法权利的行为；
            （10）恶意虚构事实、隐瞒真相以误导、欺骗他人的行为；
            （11）发布、传送、传播广告信息及垃圾信息；
            （12）其他法律法规禁止的行为。
          </li>
          <li>
            2.5.4
            您不得从事包括但不限于以下行为，也不得为以下行为提供便利（包括但不限于为您的用户的行为提供便利等）：
            （1）删除、隐匿、改变开放平台显示或其中包含的任何专利、著作权、商标或其他所有权声明；
            （2）以任何方式干扰或企图干扰喜马拉雅任何产品、任何部分或功能的正常运行，或者制作、发布、传播上述工具、方法等；
            （3）避开、尝试避开或声称能够避开任何内容保护机制，或导致用户认为其直接与喜马拉雅开放平台及喜马拉雅相关产品存在任何直接关联；
            （4）在未获得喜马拉雅书面许可的情况下，以任何方式使用或为第三方应用申请使用喜马拉雅URL地址、技术接口等；
            （5）在未经过用户同意的情况下，向任何其他用户及他方显示或以其他任何方式提供该用户的任何信息；
            （6）请求、收集、索取或以其他方式获取用户喜马拉雅网站、喜马拉雅FM应用等喜马拉雅服务的登录帐号、密码或其他任何身份验证凭据，包括但不限于喜马拉雅帐号等；
            （7）为任何用户自动登录到喜马拉雅开放平台提供代理身份验证凭据；
            （8）提供跟踪功能，包括但不限于识别其他用户在个人主页上查看、点击等操作行为；
            （9）自动将浏览器窗口定向到其他网页；
            （10）未经授权获取对喜马拉雅产品或服务的访问权；
            （11）应用中含有计算机病毒、木马或其他恶意程序等任何可能危害喜马拉雅或用户权益和终端信息安全等的内容；
            （12）设置或发布任何违反相关法规、公序良俗、社会公德等的功能或内容等；
            （13）公开表达或暗示，您与喜马拉雅之间存在合作关系，包括但不限于相互持股、商业往来或合作关系等，或声称喜马拉雅对您的认可；
            （14）填写和提交帐号注册与开发者认证资料违反本协议规定，或申请开发者认证资料与注册信息内容不一致，以及运营行为与注册或开发者认证信息所公示身份无关的；
            （15）其他喜马拉雅认为不应该、不适当的行为、内容。
          </li>
          <li>
            2.5.5
            本服务中可能会使用第三方软件或技术，若有使用，喜马拉雅保证已经获得合法授权。前述通过各种形式展现的相关协议或其他文件，均是本协议不可分割的组成部分，与本协议具有同等的法律效力，您应当遵守这些要求。否则，因此带来的一切责任您应自行承担。如因本服务使用的第三方软件或技术引发的任何纠纷，由该第三方负责解决。
          </li>
          <li> 2.6 关于用户数据的规则 </li>
          <li>
            2.6.1
            您的应用或服务对于用户数据的收集、保存、使用等必须满足以下要求：
            （1）您的应用或服务需要收集用户任何数据的，必须事先获得用户的明确同意，且仅应当收集为应用程序运行及功能实现目的而必要的用户数据，同时应当告知用户相关数据收集的目的、范围及使用方式等，保障用户知情权；
            （2）您收集用户的数据后，必须采取必要的保护措施，防止用户数据被盗、泄漏等；
            （3）您在特定应用中收集的用户数据仅可以在该特定应用中使用，不得将其使用在该特定应用之外或为其他任何目的进行使用，也不得以任何方式将其提供给他人；
            （4）您应当向用户提供修改、删除用户数据的方式，确保用户要求删除其用户数据时可通过该方式自行操作完成，并确保相关数据被完全删除。
          </li>
          <li>
            2.6.2
            未经喜马拉雅同意，您不得通过本服务收集、存储、抓取、获得或要求用户提供包括但不限于喜马拉雅网站、喜马拉雅FM应用或其它服务平台的信息内容、用户数据等喜马拉雅认为属于敏感信息范畴的数据（包括但不限于喜马拉雅的音频数据、喜马拉雅帐号、喜马拉雅密码、用户关系链、用户音频收听喜好数据），您也不得将所合法获得的前述数据自行或提供给其用户、客户用于创建、补充或维护自身内容数据。
          </li>
          <li>
            2.6.3
            未经喜马拉雅允许，您不得利用本服务所获得的数据（包括但不限于喜马拉雅音频数据等）实施或变相实施任何形式的推广、营销、广告行为。
          </li>
          <li>
            2.6.4
            如果喜马拉雅认为您收集、使用用户数据的方式，可能损害用户体验，喜马拉雅有权要求您删除相关数据并不得再以该方式收集、使用用户数据或者有权停止向您提供开放平台服务；如果给用户造成损失的，由您赔偿因此给用户造成的全部损失。
          </li>
          <li> 2.6.5 喜马拉雅有权限制或阻止您获取用户数据及开放平台数据。 </li>
          <li>
            2.6.6
            喜马拉雅开放平台运营数据、用户数据等数据的全部权利，均归属喜马拉雅，且是喜马拉雅的商业秘密，依法属于用户享有的相关权利除外。未经喜马拉雅事先书面同意，您不得为本协议约定之外的目的使用前述数据，亦不得以任何形式将前述数据提供给他人。
          </li>
          <li>
            2.6.7
            一旦开发者停止使用本服务，或停止使用开放平台，或喜马拉雅基于任何原因终止您使用本服务，您必须立即删除全部从开放平台中获得的数据（包括各种备份），且不得再以任何方式进行使用。
          </li>
          <li>
            2.6.8
            您应自行对因使用本服务而存储在喜马拉雅服务器的各类数据等信息，在本服务之外，采取合理、安全的技术措施，确保其安全性，并对自己的行为（包括但不限于自行安装软件、采取加密措施或进行其他安全措施等）所引起的结果承担全部责任。
          </li>
          <li> 2.7 法律责任 </li>
          <li>
            2.7.1
            您保证：您使用本服务及您的任何行为，不会侵犯任何人的合法权益等。
          </li>
          <li>
            2.7.2
            您理解并同意：若喜马拉雅发现或根据相关部门的信息、权利人的投诉等发现您可能存在侵犯他人合法权益情形的，喜马拉雅有权根据一般人的认识自己进行独立判断，以认定您是否存在侵犯他人合法权益情形，若喜马拉雅经过判断认为您存在侵犯他人合法权益情形的，喜马拉雅有权随时单方采取以下一项或多项措施。
            （1）对存在侵犯他人合法权益的应用采取下线措施，即终止应用使用开放平台的服务；
            （2）对存在侵犯他人合法权益的应用或您名下的全部应用或任何一应用采取下线措施即终止应用使用开放平台的服务；
            （3）禁止您今后将您的任何新应用接入开放平台；
            （4）追究您的法律责任； （5）将您的行为对外予以公告；
            （6）其他喜马拉雅认为适合的处理措施。
            对于侵犯他人合法权益的应用，假设您对应用进行修改后不再侵犯他人的合法权益，您同意喜马拉雅仍然有权对修改后的应用进行下线处理。同时，若有需要，您可以将修改后的不再侵犯他人合法权益的应用作为新应用按照开放平台的流程、规范等再次申请接入开放平台。
          </li>
          <li>
            2.7.3
            您保证：您使用本服务及您的任何行为，不违反任何相关法规、本协议和相关协议、规则等。否则，您理解并同意：若喜马拉雅自行发现或根据相关部门的信息、权利人的投诉等发现您可能存在违反前述保证情形的，喜马拉雅有权根据一般人的认识自己独立判断，以认定您是否存在违反前述保证情形，若喜马拉雅经过判断认为您存在违反前述保证情形的，喜马拉雅有权随时单方采取以下一项或多项措施。
            （1）要求您立即更换、修改违反前述保证情形的相关内容；
            （2）对存在违反前述保证情形的应用或您名下的全部应用或任何一款应用采取下线措施即终止应用使用开放平台的服务；
            （3）禁止您今后将您的任何新应用接入开放平台；
            （4）追究您的法律责任； （5）将您的行为对外予以公告；
            （6）其他喜马拉雅认为适合的处理措施。
          </li>
          <li>
            2.7.4
            若喜马拉雅按照上述条款、本协议的其他相关约定或因您违反相关法律的规定，对您或您的应用采取任何行为或措施，所引起的纠纷、责任等一概由您自行负责，造成您损失的，您应自行全部承担，造成喜马拉雅或他人损失的，您也应自行承担全部责任。
          </li>
        </ul>
        <h5>3. 喜马拉雅的权利义务</h5>
        <ul>
          <li>
            3.1
            喜马拉雅会根据您选择的服务类型向您提供相应的服务。您理解并同意，基于用户体验、喜马拉雅或其服务平台运营安全、平台规则要求及健康发展等综合因素，喜马拉雅有权选择提供服务或开展合作的对象，有权决定功能开放、数据接口和相关数据披露的对象和范围，并有权视具体情况中止或终止向存有包括但不限于以下情形的开发者或应用提供本服务：
            （1）违反法律法规或本协议规定的； （2）影响使用者体验的；
            （3）存在安全隐患的；
            （4）与喜马拉雅FM或其服务平台已有主要功能或功能组件相似、相同，或可实现上述功能或功能组件的主要效用的；
            （5）界面、风格、功能、描述或使用者体验与喜马拉雅FM或其服务平台类似，可能造成喜马拉雅用户认为其所使用的功能或服务来源于喜马拉雅或经喜马拉雅授权的；
            （6）违背喜马拉雅FM或其服务平台运营原则，或不符合喜马拉雅其他管理要求的。
            （7）本协议另有约定的其他情形。
          </li>
          <li>
            3.2
            保护您的信息的安全是喜马拉雅的一项基本原则，未经您的同意，喜马拉雅不会向喜马拉雅以外的任何公司、组织和个人披露、提供您的信息，但下列情形除外：
            （1）据本协议或其他相关协议、规则等约定可以提供的；
            （2）依据法律法规的规定可以提供的；
            （3）行政、司法等政府部门要求提供的；
            （4）您同意喜马拉雅向第三方提供；
            （5）为解决举报事件、提起诉讼而需要提供的；
            （6）为防止严重违法行为或涉嫌犯罪行为发生而采取必要合理行动所必须提供的。
          </li>
          <li>
            3.3
            尽管喜马拉雅对您的信息保护做了极大的努力，但是仍然不能保证在现有的安全技术措施下，您的信息可能会因为不可抗力或非喜马拉雅因素造成泄漏、窃取等，由此给您造成损失的，您同意喜马拉雅可以免责。
          </li>
          <li>
            3.4
            喜马拉雅有权开发、运营与您应用相似或相竞争的应用，同时喜马拉雅也不保证开放平台上不会出现其他开发者提供的与您应用的功能相竞争的应用。
          </li>
          <li>
            3.5
            喜马拉雅可将本协议下的权利和义务的部分或全部转让给他人，如果您不同意喜马拉雅的该转让，则有权停止使用本协议下服务。否则，视为您对此予以接受。
          </li>
          <li>
            3.6
            除了另行有约定外，喜马拉雅无需为按照本协议享有的权益而向您支付任何费用。
          </li>
          <li>
            3.7
            您理解并同意：为进一步推广喜马拉雅网及开放平台，喜马拉雅有权采取以下行为，而无须再取得您的同意：
            （1）在喜马拉雅开放平台及其以外的平台、网站等采取各种形式对应用进行宣传、推广；
            （2）有权为本协议目的使用您应用&品牌的LOGO、标识、名称、图片等相关素材。
          </li>
        </ul>
        <h5> 4. 关于免责 </h5>
        <ul>
          <li>
            4.1
            您理解并同意：鉴于网络服务的特殊性，喜马拉雅有权在无需通知您的情况下根据喜马拉雅开放平台的整体运营情况或相关运营规范、规则等，可以随时变更、中止或终止部分或全部的服务，若由此给您造成损失的，您同意放弃追究喜马拉雅的责任。
          </li>
          <li>
            4.2
            您理解并同意：为了向您提供更完善的服务，喜马拉雅有权定期或不定期地对提供本服务的平台或相关设备进行检修、维护、升级等，此类情况可能会造成相关服务在合理时间内中断或暂停的，若由此给您造成损失的，您同意放弃追究喜马拉雅的责任。
          </li>
          <li>
            4.3
            您理解并同意：喜马拉雅的服务是按照现有技术和条件所能达到的现状提供的。喜马拉雅会尽最大努力向您提供服务，确保服务的连贯性和安全性；但喜马拉雅不能保证其所提供的服务毫无瑕疵，也无法随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失以及其他的损失和风险。所以您也同意：即使喜马拉雅提供的服务存在瑕疵，但上述瑕疵是当时行业技术水平所无法避免的，其将不被视为喜马拉雅违约，同时，由此给您造成的数据或信息丢失等损失的，您同意放弃追究喜马拉雅的责任。
          </li>
          <li>
            4.4
            您理解并同意：在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务发生中断。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为等。出现上述情况时，喜马拉雅将努力在第一时间与相关单位配合，及时进行修复，若由此给您造成损失的，您同意放弃追究喜马拉雅的责任。
          </li>
          <li>
            4.5
            您理解并同意：若由于对以下情形导致的服务中断或受阻，给您造成损失的，您同意放弃追究喜马拉雅的责任：
            （1）受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏；
            （2）您或喜马拉雅的电脑软件、系统、硬件和通信线路出现故障；
            （3）您操作不当； （4）您通过非喜马拉雅授权的方式使用本服务；
            （5）其他喜马拉雅无法控制或合理预见的情形。
          </li>
        </ul>

        <h5> 5. 服务的中止或终止 </h5>

        <ul>
          <li>
            5.1
            如您书面通知喜马拉雅不接受本协议或对其的修改，喜马拉雅有权随时中止或终止向您提供本服务。
          </li>
          <li>
            5.2
            因不可抗力因素导致您无法继续使用本服务或喜马拉雅无法提供本服务的，喜马拉雅有权随时终止协议。
          </li>
          <li>
            5.3
            本协议约定的其他中止或终止条件发生或实现的，喜马拉雅有权随时中止或终止向您提供本服务。
          </li>
          <li>
            5.4
            由于您违反本协议约定，喜马拉雅依约终止向您提供本服务后，如您后续再直接或间接，或以他人名义注册使用本服务的，喜马拉雅有权直接单方面暂停或终止提供本服务。
          </li>
          <li>
            5.5
            由于互联网发展的不可控性，喜马拉雅有权随时终止提供开放平台，但需提前5个工作日在其网站上共识。
          </li>
          <li>
            5.6
            如本协议或本服务因为任何原因终止的，对于您的帐号中的全部数据或您因使用本服务而存储在喜马拉雅服务器中的数据等任何信息，喜马拉雅可将该等信息保留或删除，包括服务终止前您尚未完成的任何数据。
          </li>
          <li>
            5.7
            如本协议或本服务因为任何原因终止的，您应自行处理好关于数据等信息的备份以及与您的用户之间的相关事项的处理等，由此造成喜马拉雅损失的，您应负责赔偿。
          </li>
        </ul>

        <h5> 6. 关于通知 </h5>
        <ul>
          <li>
            6.1
            喜马拉雅可能会以网页公告、网页提示、电子邮箱、手机短信、常规的信件传送、您注册的本服务帐号的管理系统内发送站内信等方式中的一种或多种，向您送达关于本服务的各种规则、通知、提示等信息，该等信息一经喜马拉雅采取前述任何一种方式公布或发送，即视为您已经接受并同意，对您产生约束力。若您不接受的，请您书面通知喜马拉雅，否则视为您已经接受、同意。
          </li>
          <li>
            6.2
            若由于您提供的电子邮箱、手机号码、通讯地址等信息错误，导致您未收到相关规则、通知、提示等信息的，您同意仍然视为您已经收到相关信息并受其约束，一切后果及责任由您自行承担。
          </li>
          <li>
            6.3
            您也同意喜马拉雅或合作伙伴可以向您的电子邮件、手机号码等发送可能与本服务不相关的其他各类信息包括但不限于商业广告等。
          </li>
          <li>
            6.4
            若您有事项需要通知喜马拉雅的，应当按照本服务对外正式公布的联系方式书面通知喜马拉雅。
          </li>
        </ul>
        <h5> 7. 知识产权 </h5>
        <ul>
          <li>
            7.1
            喜马拉雅在本服务中提供的信息内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权均归喜马拉雅所有，依法属于他人所有的除外。除另有特别声明外，喜马拉雅提供本服务时所依托软件的著作权、专利权及其他知识产权均归喜马拉雅所有。喜马拉雅在本服务中所使用的“喜马拉雅INSIDE”、“喜马拉雅”、“XIMALAYA”及喜猫形象等相同或类似的品牌标识，其著作权或商标权归喜马拉雅所有。上述及其他任何喜马拉雅依法拥有的知识产权均受到法律保护，未经喜马拉雅书面许可，您不得以任何形式进行使用或创造相关衍生作品。
          </li>
          <li>
            7.2
            您仅拥有依照本协议约定合法使用本服务或相关API的权利，与本服务相关的API相关的著作权、专利权等相关全部权利归喜马拉雅所有。未经喜马拉雅书面许可，您不得违约或违法使用，不得向任何单位或个人出售、转让、转授权喜马拉雅的代码、API及开发工具等。
          </li>
        </ul>

        <h5> 8. 其他 </h5>
        <ul>
          <li>
            8.1
            本协议附件中的协议或规则、喜马拉雅可能不断发布的关于本服务的其他相关协议、规则等内容。上述内容一经正式发布，即为本协议不可分割的组成部分，您同样应当遵守。上述内容与本协议存在冲突的，以本协议为准。一经注册或使用本协议下任何服务，即视为您已阅读并同意接受本协议及上述内容的约束。喜马拉雅有权在必要时单方修改本协议或上述内容，相关内容变更后，如果您继续使用本服务，即视为您已接受修改后的相关内容。如果您不接受修改后的相关内容，应当停止使用相关服务。
          </li>
          <li> 8.2 本协议签订地为中华人民共和国上海市省浦东新区。 </li>
          <li>
            8.3
            本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。
          </li>
          <li>
            8.4
            若您和喜马拉雅之间发生任何纠纷或争议，首先应友好协商解决；协商不成功的，双方均同意将纠纷或争议提交本协议签订地有管辖权的人民法院解决。
          </li>
          <li>
            8.5
            本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。
          </li>
        </ul>
        <p>（正文完）</p>
      </div>
      <div className="developer-agreement-btns">
        <Button
          type="primary"
          onClick={() => {
            props.onOk(true);
            props.onCancel();
          }}
        >
          已阅读并同意此协议
        </Button>
        <Button onClick={props.onCancel}>关闭</Button>
      </div>
    </div>
  );
};

export default Agreement;
