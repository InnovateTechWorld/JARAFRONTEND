import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { api } from '../lib/api';
import { PaymentLink, LandingPage } from '../types';
import {
  CreditCard,
  User,
  Globe,
  Heart,
  Users,
  Eye,
  Calendar,
  Ticket,
  Package,
  DollarSign,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PublicPageData {
  success: boolean;
  page?: {
    id: string;
    creator: {
      id: string;
      name: string;
      bio: string;
      socialLinks: string[];
      jaraPageSlug: string;
    };
    pageData?: any;
    paymentLinks?: PaymentLink[];
  };
  paymentLink?: PaymentLink;
}

export function PublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<PublicPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaymentLink, setSelectedPaymentLink] = useState<PaymentLink | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    currency: 'USD',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPublicPage();
    }
  }, [slug]);

  const loadPublicPage = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      // Get public page data
      const response = await api.getPublicPage(slug) as PublicPageData;
      setPageData(response);
    } catch (error) {
      console.error('Error loading public page:', error);
      toast.error('Page not found');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentLink) return;

    try {
      setIsProcessingPayment(true);

      const paymentData = {
        paymentLinkId: selectedPaymentLink.id,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerCurrency: customerInfo.currency,
        redirectUrl: `${window.location.origin}/payment/success`,
      };

      const response = await api.initiatePayment(paymentData);

      if (response.success && response.payment_url) {
        window.location.href = response.payment_url;
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    const icons = {
      tip: Heart,
      membership: Users,
      pay_per_view: Eye,
      rental: Calendar,
      ticket: Ticket,
      product: Package,
    };
    return icons[type as keyof typeof icons] || CreditCard;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!pageData?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const { page } = pageData;

  // If it's a single payment link page
  if (pageData.paymentLink) {
    const paymentLink = pageData.paymentLink;
    const Icon = getPaymentTypeIcon(paymentLink.type);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Link Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{paymentLink.title}</CardTitle>
                      <p className="text-sm text-gray-600 capitalize">{paymentLink.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{paymentLink.description}</p>

                  {paymentLink.image_url && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={paymentLink.image_url}
                        alt={paymentLink.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        ${paymentLink.price} {paymentLink.currency}
                      </span>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{paymentLink.totalTransactions} purchases</div>
                      <div>${paymentLink.totalRevenue} total earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creator Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>About the Creator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{paymentLink.creatorId}</h4>
                      <p className="text-sm text-gray-600">Creator</p>
                    </div>
                  </div>
                  <p className="text-gray-700">Support this creator by purchasing their amazing content!</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Purchase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Payment Currency</Label>
                    <select
                      id="currency"
                      value={customerInfo.currency}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                    </select>
                  </div>

                  <Button
                    onClick={handlePayment}
                    className="w-full"
                    size="lg"
                    disabled={isProcessingPayment || !customerInfo.name || !customerInfo.email}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ${paymentLink.price} {paymentLink.currency}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-gray-500">
                <p>Secure payment powered by Flutterwave & NOWPayments</p>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If it's a landing page with multiple payment links
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Creator Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{page?.creator.name}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{page?.creator.bio}</p>
        </div>

        {/* Payment Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {page?.paymentLinks?.map((paymentLink) => {
            const Icon = getPaymentTypeIcon(paymentLink.type);

            return (
              <Card key={paymentLink.id} hover className="group">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 overflow-hidden relative">
                  {paymentLink.image_url ? (
                    <img
                      src={paymentLink.image_url}
                      alt={paymentLink.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Icon className="w-8 h-8 text-purple-400" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      paymentLink.type === 'tip' ? 'bg-pink-100 text-pink-800' :
                      paymentLink.type === 'product' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {paymentLink.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {paymentLink.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {paymentLink.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        ${paymentLink.price} {paymentLink.currency}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedPaymentLink(paymentLink)}
                      leftIcon={<ExternalLink className="w-4 h-4" />}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {(!page?.paymentLinks || page.paymentLinks.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Links Available</h3>
            <p className="text-gray-600">This creator hasn't published any payment links yet.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedPaymentLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete Your Purchase</CardTitle>
              <p className="text-sm text-gray-600">{selectedPaymentLink.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="modal-name">Full Name</Label>
                <Input
                  id="modal-name"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="modal-email">Email Address</Label>
                <Input
                  id="modal-email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPaymentLink(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  className="flex-1"
                  disabled={isProcessingPayment || !customerInfo.name || !customerInfo.email}
                >
                  {isProcessingPayment ? 'Processing...' : `Pay $${selectedPaymentLink.price}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}