import moment from "moment";

export interface B2bInquiryModels {
  count: number;
  lists: B2bInquiry[];
}

export interface B2bInquirySearch{
  type: string,
  userId: number,
  startDate: string,
  endDate: string,
  contents: string,
  status: string,
  size: number,
  page: number,


}
export interface B2bInquiry {
  id: number,
  type: number,
  userId: number,
  createdDate: string,
  contents: string,
  status: string,
}

export const DefaultB2bInquiry = () => {
  return {
    id: 1,
    type: 'shopping',
    userId: 45555,
    createdDate: '2023-05-05',
    contents: '',
    status: '답변대기'
  }
}

export const DefaultB2bInquirySearch = () =>{
  return {
    type: '',
    userId: null,
    startDate: null,
    endDate:  null,
    contents: '',
    status: '',
    size: 10,
    page: 0,
  }
}