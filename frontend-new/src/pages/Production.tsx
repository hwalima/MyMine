import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tooltip,
  CircularProgress,
  Slide,
  Fade,
  Zoom,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import Layout from '../components/layout/Layout';
import DateFilter from '../components/common/DateFilter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useDateFilterContext } from '../contexts/DateFilterContext';

interface GoldProductionRecord {
  id: number;
  date: string;
  smelted_gold: number;
  gold_recovery_rate: number;
  total_tonnage_crushed: number;
  total_tonnage_milled: number;
  operational_efficiency: number;
  notes?: string;
}

interface FormData {
  date: string;
  smelted_gold: string;
  gold_recovery_rate: string;
  total_tonnage_crushed: string;
  total_tonnage_milled: string;
  operational_efficiency: string;
  notes: string;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const INITIAL_FORM_DATA: FormData = {
  date: format(new Date(), 'yyyy-MM-dd'),
  smelted_gold: '',
  gold_recovery_rate: '',
  total_tonnage_crushed: '',
  total_tonnage_milled: '',
  operational_efficiency: '',
  notes: '',
};

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)',
  color: '#000',
  padding: theme.spacing(3),
  '& .MuiTypography-root': {
    fontSize: '1.5rem',
    fontWeight: 700,
    textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
  },
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #DAA520 0%, #FFD700 50%, #DAA520 100%)',
  }
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  background: '#1A1A1A',
  color: '#FFFFFF',
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(218,165,32,0.3)',
      },
      '&:hover fieldset': {
        borderColor: '#DAA520',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFD700',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#DAA520',
    },
    '& .MuiInputBase-input': {
      color: '#FFFFFF',
    },
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  background: '#1A1A1A',
  borderTop: '1px solid rgba(218,165,32,0.2)',
}));

const GoldButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)',
  color: '#000',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)',
  },
  boxShadow: '0 2px 8px rgba(218,165,32,0.3)',
}));

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, recordId }) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={onClose}
    closeAfterTransition
    disablePortal={false}
    aria-labelledby="delete-dialog-title"
    aria-describedby="delete-dialog-description"
    PaperProps={{
      elevation: 12,
      sx: {
        borderRadius: 3,
        minWidth: '450px',
        background: '#1A1A1A',
        border: '1px solid #DAA520',
        boxShadow: '0 0 20px rgba(218,165,32,0.2)',
      },
    }}
  >
    <StyledDialogTitle id="delete-dialog-title">
      <Box display="flex" alignItems="center" gap={2}>
        <WarningIcon sx={{ color: '#000', fontSize: 28 }} />
        Ore Processing Termination
      </Box>
    </StyledDialogTitle>
    <StyledDialogContent id="delete-dialog-description">
      <Typography variant="body1" sx={{ mb: 3, color: '#FFD700' }}>
        ⚠️ Shaft Warning: You're about to permanently remove this gold production record from the mine's ledger!
      </Typography>
      <Typography variant="body2" sx={{ color: '#DAA520' }}>
        This operation will seal off this data vein permanently. Once confirmed, even our most experienced data miners won't be able to retrieve it.
      </Typography>
    </StyledDialogContent>
    <StyledDialogActions>
      <Button 
        onClick={onClose}
        sx={{ 
          color: '#DAA520',
          '&:hover': { color: '#FFD700' }
        }}
        tabIndex={0}
      >
        Return to Surface
      </Button>
      <GoldButton
        onClick={() => onConfirm(recordId)}
        startIcon={<DeleteIcon />}
        autoFocus
        tabIndex={0}
      >
        Confirm Extraction
      </GoldButton>
    </StyledDialogActions>
  </Dialog>
);

const RecordFormDialog = ({ open, onClose, onSubmit, initialData, mode }) => {
  const [formData, setFormData] = useState(initialData);
  
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 12,
        sx: {
          borderRadius: 3,
          background: '#1A1A1A',
          border: '1px solid #DAA520',
          boxShadow: '0 0 20px rgba(218,165,32,0.2)',
        },
      }}
    >
      <StyledDialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          {mode === 'add' ? (
            <>
              <AddIcon sx={{ color: '#000', fontSize: 28 }} /> New Gold Seam Discovery
            </>
          ) : (
            <>
              <EditIcon sx={{ color: '#000', fontSize: 28 }} /> Refining Gold Data
            </>
          )}
        </Box>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Typography variant="body2" sx={{ color: '#DAA520', mb: 4 }}>
          {mode === 'add' 
            ? "💎 Opening a new mining shaft! Let's record this golden discovery in our ledger."
            : "⚒️ Refining the ore data to ensure maximum yield accuracy..."}
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 3,
          }}
        >
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Smelted Gold (g)"
            type="number"
            value={formData.smelted_gold}
            onChange={(e) => setFormData({ ...formData, smelted_gold: e.target.value })}
            fullWidth
          />
          <TextField
            label="Recovery Rate (%)"
            type="number"
            value={formData.gold_recovery_rate}
            onChange={(e) => setFormData({ ...formData, gold_recovery_rate: e.target.value })}
            fullWidth
          />
          <TextField
            label="Tonnage Crushed (t)"
            type="number"
            value={formData.total_tonnage_crushed}
            onChange={(e) => setFormData({ ...formData, total_tonnage_crushed: e.target.value })}
            fullWidth
          />
          <TextField
            label="Tonnage Milled (t)"
            type="number"
            value={formData.total_tonnage_milled}
            onChange={(e) => setFormData({ ...formData, total_tonnage_milled: e.target.value })}
            fullWidth
          />
          <TextField
            label="Operational Efficiency (%)"
            type="number"
            value={formData.operational_efficiency}
            onChange={(e) => setFormData({ ...formData, operational_efficiency: e.target.value })}
            fullWidth
          />
          <TextField
            label="Notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            fullWidth
          />
        </Box>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button 
          onClick={onClose}
          startIcon={<CancelIcon />}
          sx={{ 
            color: '#DAA520',
            '&:hover': { color: '#FFD700' }
          }}
        >
          Abandon Shaft
        </Button>
        <GoldButton
          onClick={() => onSubmit(formData)}
          startIcon={mode === 'add' ? <SaveIcon /> : <UpdateIcon />}
        >
          {mode === 'add' ? 'Strike Gold' : 'Refine Data'}
        </GoldButton>
      </StyledDialogActions>
    </Dialog>
  );
};

const SuccessAlert = ({ open, message, onClose }) => (
  <Fade in={open}>
    <Alert
      severity="success"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        minWidth: 300,
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        color: '#FFD700',
        border: '1px solid #DAA520',
        boxShadow: '0 4px 20px rgba(218,165,32,0.3)',
        borderRadius: 3,
        '& .MuiAlert-icon': {
          color: '#FFD700',
        },
      }}
      onClose={onClose}
    >
      <Typography variant="body1">
        {message || '💫 Strike! Golden operation completed successfully!'}
      </Typography>
    </Alert>
  </Fade>
);

const Production: React.FC = () => {
  // State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [editingRecord, setEditingRecord] = useState<GoldProductionRecord | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);

  const queryClient = useQueryClient();
  const { dateRange } = useDateFilterContext();

  // Fetch production records with date filter
  const { data: records = [], isLoading } = useQuery({
    queryKey: ['goldProduction', dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Format dates to match backend's expected format (YYYY-MM-DD)
      const formattedStartDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(dateRange.endDate, 'yyyy-MM-dd');

      const params = new URLSearchParams({
        from_date: formattedStartDate,
        to_date: formattedEndDate
      });

      console.log('Fetching records with date range:', { formattedStartDate, formattedEndDate });

      const response = await fetch(
        `${baseUrl}/api/mining-operations/gold-production?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }

      const data = await response.json();
      return data.data || [];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<GoldProductionRecord>) => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = editingRecord 
        ? `${baseUrl}/api/mining-operations/gold-production/${editingRecord.id}`
        : `${baseUrl}/api/mining-operations/gold-production`;
      
      const response = await fetch(url, {
        method: editingRecord ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save record');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goldProduction'] });
      handleCloseDialog();
      setSuccessAlertOpen(true);
    },
    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${baseUrl}/api/mining-operations/gold-production/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete record');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goldProduction'] });
      setSelectedRecords([]);
      setSuccessAlertOpen(true);
    },
  });

  // Handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = records.map((record: GoldProductionRecord) => record.id);
      setSelectedRecords(newSelected);
      return;
    }
    setSelectedRecords([]);
  };

  const handleSelectRecord = (id: number) => {
    const selectedIndex = selectedRecords.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRecords, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRecords.slice(1));
    } else if (selectedIndex === selectedRecords.length - 1) {
      newSelected = newSelected.concat(selectedRecords.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRecords.slice(0, selectedIndex),
        selectedRecords.slice(selectedIndex + 1)
      );
    }

    setSelectedRecords(newSelected);
  };

  const handleOpenDialog = (record?: GoldProductionRecord | null) => {
    if (record) {
      setFormData({
        date: format(new Date(record.date), 'yyyy-MM-dd'),
        smelted_gold: record.smelted_gold,
        gold_recovery_rate: record.gold_recovery_rate,
        total_tonnage_crushed: record.total_tonnage_crushed,
        total_tonnage_milled: record.total_tonnage_milled,
        operational_efficiency: record.operational_efficiency,
        notes: record.notes || '',
      });
      setEditingRecord(record);
    } else {
      setFormData(INITIAL_FORM_DATA);
      setEditingRecord(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(INITIAL_FORM_DATA);
    setEditingRecord(null);
    setFormError(null);
  };

  const handleSave = () => {
    const record = {
      date: formData.date,
      smelted_gold: parseFloat(formData.smelted_gold),
      gold_recovery_rate: parseFloat(formData.gold_recovery_rate),
      total_tonnage_crushed: parseFloat(formData.total_tonnage_crushed),
      total_tonnage_milled: parseFloat(formData.total_tonnage_milled),
      operational_efficiency: parseFloat(formData.operational_efficiency),
      notes: formData.notes,
    };

    saveMutation.mutate(record);
  };

  const handleDelete = (id: number) => {
    setRecordToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      deleteMutation.mutate(recordToDelete);
      setDeleteConfirmationOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setRecordToDelete(null);
  };

  const handleSuccessAlertClose = () => {
    setSuccessAlertOpen(false);
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Production Management
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: 'background.default'
            }}
          >
            {/* Header Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <GoldButton
                onClick={() => handleOpenDialog()}
                startIcon={
                  <AddIcon sx={{ 
                    fontSize: '1.2rem',
                    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))'
                  }} />
                }
                sx={{
                  py: 1.5,
                  px: 3,
                  fontSize: '1rem',
                  borderRadius: '50px',
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  },
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(218,165,32,0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add New Record
              </GoldButton>

              {selectedRecords.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteSelected}
                  startIcon={<DeleteIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #8B0000 0%, #FF0000 100%)',
                    color: '#FFFFFF',
                    borderRadius: '50px',
                    py: 1.5,
                    px: 3,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #A00000 0%, #FF1111 100%)',
                      boxShadow: '0 4px 12px rgba(139,0,0,0.4)',
                    },
                  }}
                >
                  Clear Selected Veins
                </Button>
              )}
            </Box>

            {/* Date Filter */}
            <DateFilter />

            {/* Records Table */}
            <TableContainer>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : records.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    No records found for the selected date range
                  </Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedRecords.length > 0 &&
                            selectedRecords.length < records.length
                          }
                          checked={
                            records.length > 0 &&
                            selectedRecords.length === records.length
                          }
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Smelted Gold (g)</TableCell>
                      <TableCell align="right">Recovery Rate (%)</TableCell>
                      <TableCell align="right">Tonnage Crushed (t)</TableCell>
                      <TableCell align="right">Tonnage Milled (t)</TableCell>
                      <TableCell align="right">Efficiency (%)</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(records as GoldProductionRecord[])
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((record) => (
                        <TableRow
                          key={record.id}
                          selected={selectedRecords.includes(record.id)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRecords.includes(record.id)}
                              onChange={() => handleSelectRecord(record.id)}
                            />
                          </TableCell>
                          <TableCell>{format(new Date(record.date), 'yyyy-MM-dd')}</TableCell>
                          <TableCell align="right">{record.smelted_gold.toFixed(2)}</TableCell>
                          <TableCell align="right">{record.gold_recovery_rate.toFixed(2)}</TableCell>
                          <TableCell align="right">{record.total_tonnage_crushed.toFixed(2)}</TableCell>
                          <TableCell align="right">{record.total_tonnage_milled.toFixed(2)}</TableCell>
                          <TableCell align="right">{record.operational_efficiency.toFixed(2)}</TableCell>
                          <TableCell>{record.notes || '-'}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(record)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(record.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Add/Edit Dialog */}
            <RecordFormDialog 
              open={openDialog} 
              onClose={handleCloseDialog} 
              onSubmit={handleSave} 
              initialData={formData} 
              mode={editingRecord ? 'edit' : 'add'} 
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog 
              open={deleteConfirmationOpen} 
              onClose={handleCancelDelete} 
              onConfirm={handleConfirmDelete} 
              recordId={recordToDelete} 
            />

            {/* Success Alert */}
            <SuccessAlert 
              open={successAlertOpen} 
              onClose={handleSuccessAlertClose} 
            />
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default Production;