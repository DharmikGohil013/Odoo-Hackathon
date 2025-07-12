import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['User', 'Skill', 'Feedback', 'Announcement', 'Report', 'Swap'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),

    // Users
    getUsers: builder.query({ query: () => '/admin/users', providesTags: ['User'] }),
    banUser: builder.mutation({ query: (id) => ({ url: `/admin/users/${id}/ban`, method: 'POST' }), invalidatesTags: ['User'] }),
    unbanUser: builder.mutation({ query: (id) => ({ url: `/admin/users/${id}/unban`, method: 'POST' }), invalidatesTags: ['User'] }),

    // Skills
    getSkills: builder.query({ query: () => '/admin/skills', providesTags: ['Skill'] }),
    approveSkill: builder.mutation({ query: (id) => ({ url: `/admin/skills/${id}/approve`, method: 'POST' }), invalidatesTags: ['Skill'] }),
    rejectSkill: builder.mutation({ query: (id) => ({ url: `/admin/skills/${id}/reject`, method: 'POST' }), invalidatesTags: ['Skill'] }),

    // Feedback
    getFeedback: builder.query({ query: () => '/admin/feedback', providesTags: ['Feedback'] }),
    deleteFeedback: builder.mutation({ query: (id) => ({ url: `/admin/feedback/${id}`, method: 'DELETE' }), invalidatesTags: ['Feedback'] }),

    // Announcements
    getAnnouncements: builder.query({ query: () => '/admin/announcements', providesTags: ['Announcement'] }),
    postAnnouncement: builder.mutation({ query: (announcement) => ({ url: '/admin/announcement', method: 'POST', body: announcement }), invalidatesTags: ['Announcement'] }),

    // Reports
    getReports: builder.query({ query: () => '/admin/reports', providesTags: ['Report'] }),

    // Swaps
    getSwaps: builder.query({ query: () => '/admin/swaps', providesTags: ['Swap'] }),

    // File upload
    uploadFile: builder.mutation({ query: (formData) => ({ url: '/upload', method: 'POST', body: formData }) }),
  }),
})

export const {
  useLoginMutation,
  useGetUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useGetSkillsQuery,
  useApproveSkillMutation,
  useRejectSkillMutation,
  useGetFeedbackQuery,
  useDeleteFeedbackMutation,
  useGetAnnouncementsQuery,
  usePostAnnouncementMutation,
  useGetReportsQuery,
  useGetSwapsQuery,
  useUploadFileMutation,
} = adminApi
