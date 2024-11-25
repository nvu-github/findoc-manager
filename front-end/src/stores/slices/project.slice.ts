import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Project } from '../../types'
import axios from '../../services/api'

interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null
}

export const addProjectAsync = createAsyncThunk(
  'project/addProject',
  async (newProject: Omit<Project, 'projectId'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/project', newProject)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add project')
    }
  }
)

export const updateProjectAsync = createAsyncThunk(
  'project/updateProject',
  async ({ projectId, updatedProject }: { projectId: number; updatedProject: Project }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/project/${projectId}`, updatedProject)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project')
    }
  }
)

export const deleteProjectAsync = createAsyncThunk(
  'project/deleteProject',
  async (projectId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/project/${projectId}`)
      return projectId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project')
    }
  }
)

export const getAllProjectsAsync = createAsyncThunk('project/getProjects', async (filter: any, { rejectWithValue }) => {
  try {
    const response = await axios.get('/project', { params: filter })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects')
  }
})

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProjectAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addProjectAsync.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false
        state.projects.push(action.payload)
      })
      .addCase(addProjectAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateProjectAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProjectAsync.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false
        const index = state.projects.findIndex((p) => p.projectId === action.payload.projectId)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
      })
      .addCase(updateProjectAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteProjectAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.projects = state.projects.filter((p) => p.projectId !== action.payload)
      })
      .addCase(deleteProjectAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAllProjectsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllProjectsAsync.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(getAllProjectsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default projectSlice.reducer
