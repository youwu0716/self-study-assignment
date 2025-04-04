import { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

// Mock payment record data
const mockPayments = [
  {
    id: 1,
    type: 'Property Fee',
    amount: 1200,
    period: 'Q1 2024',
    dueDate: '2024-03-31',
    status: 'Unpaid'
  },
  {
    id: 2,
    type: 'Parking Fee',
    amount: 300,
    period: 'March 2024',
    dueDate: '2024-03-31',
    status: 'Paid'
  },
  {
    id: 3,
    type: 'Utilities',
    amount: 258.50,
    period: 'February 2024',
    dueDate: '2024-02-29',
    status: 'Paid'
  }
];

export default function Payments() {
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePayClick = (payment) => {
    setSelectedPayment(payment);
    setOpenPayDialog(true);
  };

  const handlePayment = async () => {
    try {
      // Will call the actual payment API here
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          amount: selectedPayment.amount
        }),
      });

      if (response.ok) {
        // Handle successful payment
        setOpenPayDialog(false);
        setSelectedPayment(null);
        // Should refresh payment record list here
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Property Payments
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fee Type</TableCell>
              <TableCell>Amount (¥)</TableCell>
              <TableCell>Payment Period</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.period}</TableCell>
                <TableCell>{payment.dueDate}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>
                  {payment.status === 'Unpaid' && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handlePayClick(payment)}
                    >
                      Pay Now
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)}>
        <DialogTitle>Payment Confirmation</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ pt: 2 }}>
              <Typography gutterBottom>
                Fee Type: {selectedPayment.type}
              </Typography>
              <Typography gutterBottom>
                Payment Period: {selectedPayment.period}
              </Typography>
              <Typography gutterBottom>
                Amount Due: ¥{selectedPayment.amount.toFixed(2)}
              </Typography>
              <TextField
                fullWidth
                label="Payment Verification Code"
                type="number"
                margin="normal"
                helperText="Please enter the SMS verification code"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayDialog(false)}>Cancel</Button>
          <Button onClick={handlePayment} variant="contained" color="primary">
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}