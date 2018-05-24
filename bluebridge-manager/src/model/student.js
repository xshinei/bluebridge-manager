export default class {
  constructor({Id, Name, Username, Email, Grade, Profession, TeacherId, TeacherName, Avatar}) {
    this.Id = Id;
    this.Name = Name;
    this.Username = Username;
    this.Email = Email;
    this.Grade = Grade;
    this.Profession = Profession;
    this.TeacherId = TeacherId;
    this.TeacherName = TeacherName;
    this.Avatar = Avatar;
  }
}

export const config = {
  PROFESSION_LIST: ['计算机一班', '计算机二班', '信息管理', '软件工程'],
  LANGUAGE_LIST: ['C/C++', 'JAVA'],
  GRADE_LIST: (() => {
    let list = [];

    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    let maxGrade = month >= 8 ? year : year - 1;

    for(let i = 15; i <= maxGrade - 2000; i++) {
      list.push(i);
    }

    return list;
  })()
};
