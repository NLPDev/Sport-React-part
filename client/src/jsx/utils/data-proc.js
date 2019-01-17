import moment from 'moment'

const utils = () => {

  const constructSkillSet = (assessmentDefs, assessments, sport, subType, withAss, assDate) => {

    if (!assessmentDefs || (withAss && !assessments) || !sport) return [];

    const sportDefs = assessmentDefs.find(a => (!sport) || (sport.toLowerCase() == a.name.toLowerCase())).childs;
    const curDefs = sportDefs[subType];
    const allAssessed = withAss ? getAllAssessed(assessments, sport, subType) : null;
    const processAss = (def) => {
            let ass = null;

            if (withAss && allAssessed) {
              ass = allAssessed.find(a => a[0].assessment_id == def.id);

              if (ass) {
                if (assDate) {
                  ass = ass.filter(a => moment(a.date_assessed, 'YYYY-MM-DD').isSame(moment(assDate)));
                }
                ass = ass.sort((a1, a2) => {
                  const d1 = new Date(a1.date_assessed);
                  const d2 = new Date(a2.date_assessed);

                  return d1 < d2;
                })
              }
            }
            return ass;
          }

    if (curDefs.is_flat) {
      const defsWithAss = curDefs.childs.reduce((acc, def) => {
        let ass = processAss(def);

        if (withAss && allAssessed) {
          ass = allAssessed.find(a => a[0].assessment_id == def.id);

          if (ass) {
            ass = ass.sort((a1, a2) => {
              const d1 = new Date(a1.date_assessed);
              const d2 = new Date(a2.date_assessed);

              return d1 < d2;
            })
          }
        }
        const skill = { name: def.name,
                        assessment_id: def.id,
                        unit: def.unit,
                        modified: false }
        if (ass) {
          skill.id = ass[0].id;
          skill.history = ass;
          if (ass[0].level) {
            skill.level = ass[0].level;
          } else if (ass[0].value) {
            skill.value = ass[0].value;
          }
        }
        if ((!withAss) || (withAss && ass)) {
          acc.push(skill);
        }
        return acc;
      }, []);

      return [{ setName: sportDefs[subType].name,
                setType: 'values',
                skills: defsWithAss,
                childs: defsWithAss }];
    } else {
      return curDefs.childs.map(def => {

        const skills = def.childs.reduce((acc, s) => {

          let ass = processAss(s);
          const skill = { name: s.name,
                          unit: s.unit,
                          level: ass ? parseInt(ass[0].value) : 0,
                          assessment_id: s.id,
                          modified: false }
          if (ass) {
            skill.id = ass[0].id;
            skill.history = ass;
            skill.value = ass[0].value;
          }
          if ((!withAss) || (withAss && ass)) {
            acc.push(skill);
          }
          return acc;
        }, []);

        return { setName: def.name,
                 id: def.id,
                 setType: 'values',
                 childs: skills };
      });
    }
  }

  const getAllAssessed = (assessments, sport, subType) => {

    const sportAss = assessments.find(a => sport.toLowerCase() == a.name.toLowerCase()).childs;
    let allAssessed;

    if (sportAss[subType].is_flat) {
      allAssessed = sportAss[subType].childs;
    } else {
      allAssessed = sportAss[subType].childs.reduce((acc, set) => {
        acc = acc.concat(set.childs.slice());
        return acc;
      }, []);
    }
    return allAssessed;
  }

  const getSubSports = (assDefs, user, a_id) => {

    if (!(assDefs && user)) return [];

    return assDefs.reduce((acc, topDef) => {

      if (topDef.id > 9999) return acc;

      if ('coach' == user.user_type) {
        const athlete = user.linked_users.find(a => a.id == a_id);

        if (athlete.granted_assessment_top_categories.find(granted => granted.id == topDef.id)) {
          acc = acc.concat(topDef.childs.map((subDef, i) => ({ idTop: topDef.id,
                                                               nameTop: topDef.name.trim(),
                                                               id:subDef.id,
                                                               name: subDef.name.trim(),
                                                               indexInTopCat: i })));
        }
      } else {
        if (user.chosen_sports.find(s => s.sport_id == topDef.id && s.is_displayed)) {
          acc = acc.concat(topDef.childs.map((subDef, i) => ({ idTop: topDef.id,
                                                               nameTop: topDef.name.trim(),
                                                               id:subDef.id,
                                                               name: subDef.name.trim(),
                                                               indexInTopCat: i })));
        }
      }
      return acc;
    }, []);
  }

  const getFlattenedAss = (assDefs, assessments) => {

    const ret = assDefs.childs.reduce((acc, skillSetDef) => {  // skillSet is "Skating", "Passing", ...

             const skillSetAss = assessments.childs.find(assSet => assSet.id == skillSetDef.id)

             if (skillSetDef.childs) {
               const skills = skillSetDef.childs.map(skillDef => {  // skillSet is "Control/Mobility", "Change of Pace"

                 let level = 0;

                 if (skillSetAss) {
                   let skillAss = skillSetAss.childs.find(skillAss => skillAss[0].assessment_id == skillDef.id);
                                                       // skillAss is an array of history
                   if (skillAss) {
                     skillAss = skillAss.sort((a1, a2) => {
                                  const d1 = new Date(a1.date_assessed);
                                  const d2 = new Date(a2.date_assessed);

                                  return d1 < d2;
                                });
                     level = parseInt(skillAss[0].value);
                   }
                 }
                 return { name: skillDef.name,
                          level,
                          assessment_id: skillDef.id,
                          modified: false }
                 });
               acc = acc.concat(skills.slice());
             } else {
               let skillAss = skillSetAss && skillSetAss.childs.find(skillAss => skillAss[0].assessment_id == skillSetDef.id);
               let level = 0;

               if (skillAss) {
                 skillAss = skillAss.sort((a1, a2) => {
                              const d1 = new Date(a1.date_assessed);
                              const d2 = new Date(a2.date_assessed);

                              return d1 < d2;
                            });

                 level = skillAss[0].value;
               }
               acc.push({ name: skillSetDef.name,
                          level,
                          assessment_id: skillSetDef.id,
                          modified: false })
             }
             return acc;
           }, []);
    return ret;
  }

  const getAssessmentValue = (id, assessments) => {

    for (let i = 0; i < assessments.childs.length; i++) {
      for (let j = 0; j < assessments.childs[i].childs.length; j++) {
        if (assessments.childs[i].childs[j][0].assessment_id == id) {
          return assessments.childs[i].childs[j];
        }
      }
    }
    return null;
  }

  const getPhysicalDefs = (assessmentDefs, assessments, withAss, assDate) => {

    if (!assessmentDefs) return [];

    const defs = assessmentDefs.find(a => 'General-Physical' == a.name);

    if (!withAss) {
      return JSON.parse(JSON.stringify(defs.childs));
    }

    if (!assessments) return [];

    const ass = assessments.find(a => 'General-Physical' == a.name);

    const newDefs = JSON.parse(JSON.stringify(defs));
    return newDefs.childs.map(def => {

      const assesForDef = ass.childs.find(a => a.id == def.id);

      if ('Fundamental Movement Skills' == def.name) {
        def.childs = def.childs.map(ass => {

          const assForDef = assesForDef.childs.find(a => a[0].assessment_id == ass.id);

          if (assForDef) {
            ass.values = assForDef;
            if (assDate) {
              const assForDate = ass.values.find(v => moment(v.date_assessed, 'YYYY-MM-DD').isSame(moment(assDate)));

              if (assForDate) {
                ass.level = assForDate.value;
              }
            }
          }
          return ass;
        })
      } else {

        def.childs = def.childs.map(assSets => {

          const assSetForDef = assesForDef.childs.find(a => a.name == assSets.name);

          assSets.childs = assSets.childs.map(skill => {

            const values = getAssessmentValue(skill.id, assesForDef);

            if (values) {
              skill.values = values;
              if (assDate) {
                const assForDate = skill.values.find(v => moment(v.date_assessed, 'YYYY-MM-DD').isSame(moment(assDate)));

                if (assForDate) {
                  skill.value = assForDate.value;
                  skill.level = assForDate.value;
                }
              }
            }
            return skill;
          })
          return assSets;
        })
      }
      return def;
    });
  }

  const getHistory = (assessments, cat, subCat) => {

    if (!assessments || 0 == assessments.length || cat < 0) return {unit: '', histories: []};

    const assForCat = assessments[cat];

    if (0 == cat) { // Fundamental Movement
      return assessments[0].childs[subCat].values ?
          { unit: 'stars', histories: [{name: '', values: assessments[0].childs[subCat].values}] } :
          { unit: 'stars', histories: [] };
    } else {

      const ass = assessments[cat].childs[subCat];
      const unit = ass.childs[0].unit;

      return { unit, histories: ass.childs.reduce((acc, cur) => {
                                  if (cur.values) acc.push({name: cur.name, values: cur.values});
                                  return acc; }, []).slice()};
    }
  }

const getMentalDefs = (assessmentDefs, assessments, withAss, assDate) => {

    if (!assessmentDefs) return [];

    const defs = assessmentDefs.find(a => 'General-Leadership' == a.name);

    if (!withAss) {
      return JSON.parse(JSON.stringify(defs.childs));
    }

    if (!assessments) return [];
    
    const ass = assessments.find(a => 'General-Leadership' == a.name);
    const newDefs = JSON.parse(JSON.stringify(defs));
    return newDefs.childs.map(def => {

      const assesForDef = ass.childs.find(a => a.id == def.id);

      def.childs = def.childs.map(assSets => {

        const assSetForDef = assesForDef.childs.find(a => a.name == assSets.name);

        assSets.childs = assSets.childs.map(skill => {

          const values = getAssessmentValue(skill.id, assesForDef);

          if (values) {
            skill.values = values;
            if (assDate) {
              const assForDate = skill.values.find(v => moment(v.date_assessed, 'YYYY-MM-DD').isSame(moment(assDate)));

              if (assForDate) {
                skill.value = assForDate.value;
                skill.level = assForDate.value;
              }
            }
          }
          return skill;
        })
        return assSets;
      })
      return def;
    });
  }

  const getHistoryForType = (skillSets, type) => {

    if (!skillSets.length) return {unit: '', groups: []};

    const groups = skillSets.map(skillSet => {

      const skillsToInclude = skillSet.childs.filter(s => s.history &&
                                                          s.history.find(h => 'coach' == type ?
                                                                              h.assessor_id != h.assessed_id :
                                                                              h.assessor_id == h.assessed_id));

      return { groupName: skillSet.setName,
               histories: skillsToInclude.map(skill => {

                            return { name: skill.name,
                                     values: skill.history.filter(point => 'coach' == type ?
                                                                           point.assessor_id != point.assessed_id :
                                                                           point.assessor_id == point.assessed_id)
                                               .sort((p1, p2) => {
                                                  const d1 = new Date(p1.date_assessed);
                                                  const d2 = new Date(p2.date_assessed);

                                                  return d1 > d2;
                                               }) };
                          }) };
    });
    return { unit: 'stars', groups }
  }

  const getAthleteHistory = (skillSets) => {

    return getHistoryForType(skillSets, 'athlete');
  }

  const getCoachHistory = (skillSets) => {

    return getHistoryForType(skillSets, 'coach');
  }

  const getSkillsMental = (skillSetsMental, curSubCatMental, forAthlete) => {

    let ss = skillSetsMental.length ?
               skillSetsMental[curSubCatMental].childs : [];

    ss = JSON.parse(JSON.stringify(ss));
    ss = ss.map(s => {

      s.history = s.history
        .filter(a => forAthlete ? a.assessed_id == a.assessor_id : a.assessed_id != a.assessor_id)
        .sort((a1, a2) => {
          const d1 = new Date(a1.date_assessed);
          const d2 = new Date(a2.date_assessed);

          return d1 > d2;
        });
       return s;
    });
    return ss;
  }

  const flattenSkillsForRadar = (skillSets, sport) => {

    if ('Rugby' == sport || 'Tennis' == sport) return [];

    const ss = skillSets.reduce((acc, skillSet) => {
                 acc = acc.concat(skillSet.childs.slice());
                 return acc;
               }, []);
    return ss;
  }

  const isRadarChart = (sport) => {

    return 'Baseball' == sport ||
           'Basketball' == sport ||
           'Hockey' == sport ||
           'Soccer' == sport ||
           'Volleyball' == sport;
  }

  return { constructSkillSet,
           getSubSports,
           getFlattenedAss,
           getPhysicalDefs,
           getMentalDefs,
           getHistory,
           getAthleteHistory,
           getCoachHistory,
           getSkillsMental,
           flattenSkillsForRadar,
           isRadarChart }
}

export default utils()
