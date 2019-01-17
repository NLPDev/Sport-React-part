import config from '../../../config'

const api = () => {

  const rootUrl = config.backend;

  const ajaxCall = (route, method, data = null) => {

    
    return new Promise((res, rej) => {
      const forSend = {
              url: rootUrl + route,
              type: method,
              contentType: "application/json",
              beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
            }
      if (data) {
        forSend.data = JSON.stringify(data);
      }
      $.ajax(forSend)
      .then(result => {
        res(result);
      })
      .fail(err => {
        console.log(err);
        if (401 == err.status) {
          location = '/login';
        } else {
          rej(err);
        }
      });
    });
  }

  const createUser = async user => {

    return await $.ajax({ url: rootUrl + 'users/',
                          type: 'POST',
                          contentType: "application/json",
                          data: JSON.stringify(user) });
  }

  const getUser = async () => {

    if (localStorage.getItem('user_id') && localStorage.getItem('jwt_token')) {
      return await $.ajax({
           url: rootUrl + 'users/' + localStorage.getItem('user_id') + '/',
           type: "GET",
           beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
        });
    } else {
      return new Promise((res, rej) => {
        rej('No id or token');
      });
    }
  }

  const updateUser = async user => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/', 'PUT', user);
  }

  const uploadUserProfilePic = async formData => {

    return await $.ajax({
        url: rootUrl + 'users/' + localStorage.getItem('user_id') + '/picture/',
        type: 'PUT',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    })
  }

  const sendPaymentInfo = (token, plan) => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/payment/', 'POST', {token, plan});
  }

  const sendPaymentCard = token => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/payment/card/', 'PUT', {token});
  }

  const sendPaymentPlan = async plan => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/payment/plan/', 'PUT', {plan});
  }

  const requestPasswordReset = async (email) => {

    return await $.ajax({
         url: rootUrl + 'password/reset/',
         type: 'POST',
         contentType: "application/json",
         data: JSON.stringify({ email })
      });
  }

  const resetPassword = async (password, token) => {

    return await $.ajax({
         url: rootUrl + 'password/reset/confirm/',
         type: 'POST',
         contentType: "application/json",
         data: JSON.stringify({ password, confirm_password: password, reset_password_token: token })
      });
  }

  const login = async (email, password) => {

    return await $.ajax({
        url: rootUrl + 'login/',
        contentType: "application/json",
        type: 'POST',
        data: JSON.stringify({ email, password })
    });
  }

  const unlinkUser = email => {

    return ajaxCall('users/invite/unlink/', 'DELETE', { linked_user: email });
  }

  const getCreditCardInfo = async () => {

    return await $.ajax({
      url: rootUrl + 'users/' + localStorage.getItem('user_id') + '/payment/card/',
      type: 'GET',
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    })
  }

  const getPaymentPlan = async () => {
    return await $.ajax({
      url: rootUrl + 'users/' + localStorage.getItem('user_id') + '/payment/plan/',
      type: 'GET',
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    })
  }

  const getPhysicalAssDefs = () => {

    return ajaxCall('assessments/?top_category_ids=10000', 'GET');
  }

  const sendInvitation = async recipients => {

    return await $.ajax({
        url: rootUrl + 'users/invite/',
        type: 'POST',
        contentType: "application/json",
        beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) },
        data: JSON.stringify(recipients)
    });
  }

  const resendInvite = async id => {

    return await $.ajax({
        url: rootUrl + 'users/invite/resend/',
        type: 'POST',
        contentType: "application/json",
        beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) },
        data: JSON.stringify({id})
    });
  }

  const acceptInvitation = async token => {

    return await $.ajax({
        url: rootUrl + 'users/invite/confirm/',
        type: 'POST',
        contentType: "application/json",
        beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) },
        data: JSON.stringify({ user_invite_token: token })
    });
  }

  const listAssessment = () => {

    return ajaxCall('assessments/', 'GET');
  }

  const retrieveAssessments = (uid, tId) => {

    return ajaxCall('users/' + (uid || localStorage.getItem('user_id')) + '/assessments/' + (tId ? '?team_id=' + tId : ''),
                    'GET');
  }

  const updateAssessments = (assessments) => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/assessments/', 'PUT', assessments);
  }

  const newAssessments = (assessments, aId) => {

    return ajaxCall('users/' + (aId || localStorage.getItem('user_id')) + '/assessments/', 'POST', assessments);
  }

  const getPermissionSetting = c_id => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/assessments/permissions/?assessor_id=' + c_id,
                    'GET');
  }

  const updatePermissions = (c_id, permissions) => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/assessments/permissions/?assessor_id=' + c_id,
                    'PUT',
                    permissions);
  }

  const getAssessmentHistory = id => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/assessments/?assessment_id=' + id + '&rendering=flat',
                    'GET');
  }

  const cancelMembership = email => {

    return ajaxCall('users/' + localStorage.getItem('user_id') + '/', 'DELETE');
  }

  const getSports = () => {

    return ajaxCall('sports/', 'GET');
  }

  const createTeam = team => {

    return ajaxCall('teams/', 'POST', team);
  }

  const updateTeam = (team, tId) => {

    return ajaxCall(`teams/${tId}/`, PUT, team);
  }

  const getTeamInfo = teamId => {

    return ajaxCall(`teams/${teamId}/`, 'GET');
  }

  const uploadTeamProfilePic = async (formData, tId) => {


    return await $.ajax({
        url: `${rootUrl}teams/${tId}/picture/`,
        type: 'PUT',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    })
  }

  const newTeamAssessments = (assessments, tId) => {

    return ajaxCall(`teams/${tId}/assessments/`, 'POST', assessments);
  }

  const getTeamAssessments = (tId, assessment_id) => {

    return ajaxCall(`teams/${tId}/assessments/?latest&assessment_id=${assessment_id}`, 'GET');
  }

  const retrieveGoals = () => {

    return ajaxCall('goals/', 'GET');
  }

  const getPendingInvites = () => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/invites/`, 'GET');
  }

  const addPreCompetitionAss = (preCompete) => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/precompetitions/`, 'POST', preCompete);
  }

  const getPreCompitionAss = (aId) => {

    return ajaxCall(`users/${aId || localStorage.getItem('user_id')}/precompetitions/?latest`, 'GET');
  }

  const addGoal = (goal) => {

    return ajaxCall('goals/', 'POST', goal);
  }

  const updateGoal = (gId, goal) => {

    return ajaxCall(`goals/${gId}/`, 'PUT', goal);
  }

  const getGoal = (gId) => {

    return ajaxCall(`goals/${gId}/`, 'GET');
  }

  const updatePreCompetitionAss = (preCompete, pId) => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/precompetitions/${pId}/`, 'PUT', preCompete);
  }

  const getTeamPreCompeteStatus = (teamId) => {

    return ajaxCall(`teams/${teamId}/precompetitions/`, 'GET');
  }

  const cancelPendingInvite = (id) => {

    return ajaxCall('users/invite/revoke/', 'DELETE', {id});
  }

  const cancelAllPendingInvite = (ids) => {

    return ajaxCall('users/invite/revoke/', 'DELETE', ids);
  }

  const getVideos = () => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/videos/`, 'GET');
  }

  const addVideo = (video) => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/videos/`, 'POST', video);
  }

  const deleteVideo = (vId) => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/videos/${vId}/`, 'DELETE');
  }

  const addAward = (award) => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/achievements/`, 'POST', award);
  }

  const updateAward = (award) => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/achievements/${award.id}/`, 'PUT', award);
  }

  const retrieveAwards = () => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/achievements/`, 'GET');
  }

  const retrieveAward = (awardId) => {

    return ajaxCall(`users/${localStorage.getItem('user_id')}/achievements/${awardId}`, 'GET');
  }

  const getBadges = () => {

    return ajaxCall('badges/', 'GET');
  }

  const getRTPTypes = async () => {

    return await $.ajax({
      url: `${rootUrl}return_to_play_types/`,
      type: 'GET',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    })
  }

  const addNote = async (note, noteType) => {

    return await $.ajax({
      url: `${rootUrl}users/${localStorage.getItem('user_id')}/${noteType}/`,
      type: 'POST',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) },
      data: JSON.stringify(note)
    });
  }

  const addAthleteNote = async (note) => {

    return await addNote(note, 'athletenotes');
  }
  
  const addCoachNote = async (note) => {

    return await addNote(note, 'coachnotes');
  }

  const getAthleteNotes = async () => {

    const pNoteAthlete = $.ajax({
      url: `${rootUrl}users/${localStorage.getItem('user_id')}/athletenotes/`,
      type: 'GET',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
    const pNoteCoach = $.ajax({
      url: `${rootUrl}coachnotes/?athelete_id=${localStorage.getItem('user_id')}/`,
      type: 'GET',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
    return await Promise.all([pNoteAthlete, pNoteCoach]);
  }

  const getCoachNotes = async () => {

    const pNoteCoach = $.ajax({
      url: `${rootUrl}users/${localStorage.getItem('user_id')}/coachnotes/`,
      type: 'GET',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
    const pNoteAthlete = $.ajax({
      url: `${rootUrl}athletenotes/`,
      type: 'GET',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
    return await Promise.all([pNoteAthlete, pNoteCoach]);
  }

  const getAthleteNote = async (noteId, athleteId) => {

    return await $.ajax({
      url: `${rootUrl}users/${athleteId || localStorage.getItem('user_id')}/athletenotes/${noteId}/`,
      type: 'GET',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
  }

  const getCoachNote = async (noteId, coachId) => {

    return await $.ajax({
      url: `${rootUrl}users/${coachId || localStorage.getItem('user_id')}/coachnotes/${noteId}/`,
      type: 'GET',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
  }

  const updateAthleteNote = async (note) => {

    return await $.ajax({
      url: `${rootUrl}users/${localStorage.getItem('user_id')}/athletenotes/${note.id}/`,
      type: 'PUT',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) },
      data: JSON.stringify(note)
    });
  }

  const updateCoachNote = async (note) => {

    return await $.ajax({
      url: `${rootUrl}users/${localStorage.getItem('user_id')}/coachnotes/${note.id}/`,
      type: 'PUT',
      contentType: "application/json",
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) },
      data: JSON.stringify(note)
    });
  }

  const deleteAthleteNote = async (noteId) => {

    return $.ajax({
      url: `${rootUrl}users/${localStorage.getItem('user_id')}/athletenotes/${noteId}/`,
      type: 'DELETE',
      contentType: 'application/json',
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
  }

  const deleteCoachNote = async (noteId) => {

    return $.ajax({
      url: `${rootUrl}users/${localStorage.getItem('user_id')}/coachnotes/${noteId}/`,
      type: 'DELETE',
      contentType: 'application/json',
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
  }

  const uploadFile = async formData => {

    return await $.ajax({
        url: `${rootUrl}files/`,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
  }

  const deleteFile = async fileId => {

    return await $.ajax({
      url: `${rootUrl}files/${fileId}/`,
      type: 'DELETE',
      contentType: 'application/json',
      beforeSend: xhr => { xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('jwt_token')) }
    });
  }

  return { createUser,
           getUser,
           updateUser,
           uploadUserProfilePic,
           sendPaymentInfo,
           sendPaymentCard,
           sendPaymentPlan,
           login,
           getCreditCardInfo,
           unlinkUser,
           getPhysicalAssDefs,
           resetPassword,
           requestPasswordReset,
           sendInvitation,
           resendInvite,
           acceptInvitation,
           listAssessment,
           retrieveAssessments,
           updateAssessments,
           newAssessments,
           updatePermissions,
           getPermissionSetting,
           getAssessmentHistory,
           getPaymentPlan,
           cancelMembership,
           createTeam,
           updateTeam,
           getSports,
           uploadTeamProfilePic,
           getTeamInfo,
           newTeamAssessments,
           getTeamAssessments,
           retrieveGoals,
           addGoal,
           updateGoal,
           getGoal,
           getPendingInvites,
           cancelPendingInvite,
           cancelAllPendingInvite,
           addPreCompetitionAss,
           getPreCompitionAss,
           updatePreCompetitionAss,
           getTeamPreCompeteStatus,
           getVideos,
           addVideo,
           deleteVideo,
           addAward,
           retrieveAwards,
           getBadges,
           retrieveAward,
           updateAward,
           getRTPTypes,
           addAthleteNote,
           addCoachNote,
           getAthleteNotes,
           getCoachNotes,
           uploadFile,
           deleteAthleteNote,
           deleteCoachNote,
           getAthleteNote,
           getCoachNote,
           updateAthleteNote,
           updateCoachNote,
           deleteFile }
}

export default api();
