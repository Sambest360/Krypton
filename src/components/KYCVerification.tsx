
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';

const KYCVerification: React.FC = () => {
  const [documentType, setDocumentType] = useState('id');
  const [documentId, setDocumentId] = useState('');
  const [error, setError] = useState('');
  const { submitKYC, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!documentId) {
      setError('Please enter your document ID');
      return;
    }
    
    const success = await submitKYC(
      documentType === 'id' ? 'ID Card' : 'Driver\'s License',
      documentId
    );
    
    if (!success) {
      setError('KYC verification failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
        <CardDescription>
          Complete your identity verification to access all features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <RadioGroup 
                value={documentType} 
                onValueChange={setDocumentType}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="id" id="id-card" />
                  <Label htmlFor="id-card" className="cursor-pointer">ID Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="license" id="drivers-license" />
                  <Label htmlFor="drivers-license" className="cursor-pointer">Driver's License</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document-id">Document Number</Label>
              <Input
                id="document-id"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder={documentType === 'id' ? 'ID12345678' : 'DL98765432'}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document-upload">Upload Document (Optional)</Label>
              <Input
                id="document-upload"
                type="file"
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a clear photo or scan of your document
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-trading-primary hover:bg-trading-secondary" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Verification'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p>
          Your information is secure and will only be used for verification purposes.
        </p>
      </CardFooter>
    </Card>
  );
};

export default KYCVerification;
