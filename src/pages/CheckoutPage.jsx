import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useCart } from '../api/cart'
import { useAddresses, useCreateAddress } from '../api/addresses'
import { usePlaceOrder } from '../api/orders'
import { formatPrice } from '../utils/formatPrice'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { PageLoader } from '../components/ui/Spinner'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { data: cart, isLoading: cartLoading } = useCart()
  const { data: addresses, isLoading: addrLoading } = useAddresses()
  const { mutate: placeOrder, isPending: placing } = usePlaceOrder()
  const { mutate: createAddr, isPending: creatingAddr } = useCreateAddress()

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)

  // Auto-select default (or first) address when loaded
  useEffect(() => {
    if (!selectedAddress && addresses?.length) {
      const def = addresses.find((a) => a.is_default) || addresses[0]
      setSelectedAddress(def.id)
    }
  }, [addresses])
  const [notes, setNotes] = useState('')
  const [newAddr, setNewAddr] = useState({
    full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })
  const [errors, setErrors] = useState({})

  const setAddr = (key, val) => setNewAddr((a) => ({ ...a, [key]: val }))

  const validateNewAddr = () => {
    const e = {}
    if (!newAddr.full_name.trim()) e.full_name = 'Required'
    if (!newAddr.phone.trim() || newAddr.phone.length < 10) e.phone = 'Valid phone required'
    if (!newAddr.line1.trim()) e.line1 = 'Required'
    if (!newAddr.city.trim()) e.city = 'Required'
    if (!newAddr.state) e.state = 'Required'
    if (!newAddr.pincode.trim() || newAddr.pincode.length < 6) e.pincode = 'Valid pincode required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSaveAddress = () => {
    if (!validateNewAddr()) return
    createAddr(newAddr, {
      onSuccess: (saved) => {
        setSelectedAddress(saved.id)
        setShowNewForm(false)
        setNewAddr({ full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })
      },
    })
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address.')
      return
    }
    placeOrder({ address_id: selectedAddress, notes }, {
      onSuccess: (order) => navigate(`/orders/${order.id}`),
    })
  }

  if (cartLoading || addrLoading) return <PageLoader />

  if (!cart?.items?.length) {
    navigate('/cart')
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8"
    >
      <h1 className="font-heading font-bold text-2xl text-text mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Address + Notes */}
        <div className="lg:col-span-3 space-y-6">
          {/* Address selection */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-base mb-4">Delivery Address</h2>

            {(addresses || []).length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      selectedAddress === addr.id
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-0.5 accent-primary"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-text">{addr.full_name}</p>
                      <p className="text-slate-500">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                      <p className="text-slate-500">{addr.city}, {addr.state} – {addr.pincode}</p>
                      <p className="text-slate-500">📞 {addr.phone}</p>
                    </div>
                    {addr.is_default && (
                      <span className="ml-auto text-xs bg-primary text-white px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <PlusIcon className="w-4 h-4" />
              {showNewForm ? 'Cancel' : 'Add New Address'}
            </button>

            {showNewForm && (
              <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Full Name *" value={newAddr.full_name} onChange={(e) => setAddr('full_name', e.target.value)} error={errors.full_name} />
                  <Input label="Phone *" value={newAddr.phone} onChange={(e) => setAddr('phone', e.target.value)} error={errors.phone} />
                </div>
                <Input label="Address Line 1 *" value={newAddr.line1} onChange={(e) => setAddr('line1', e.target.value)} error={errors.line1} />
                <Input label="Address Line 2" value={newAddr.line2} onChange={(e) => setAddr('line2', e.target.value)} />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="City *" value={newAddr.city} onChange={(e) => setAddr('city', e.target.value)} error={errors.city} />
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">State *</label>
                    <select value={newAddr.state} onChange={(e) => setAddr('state', e.target.value)} className={`input-field ${errors.state ? 'border-red-400' : ''}`}>
                      <option value="">Select</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <Input label="Pincode *" value={newAddr.pincode} onChange={(e) => setAddr('pincode', e.target.value)} error={errors.pincode} />
                </div>
                <Button onClick={handleSaveAddress} loading={creatingAddr} size="sm">
                  Save Address
                </Button>
              </div>
            )}
          </div>

          {/* Payment method */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-base mb-3">Payment Method</h2>
            <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary bg-primary-50">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-semibold text-sm text-text">Cash on Delivery</p>
                <p className="text-xs text-slate-500">Pay when your order arrives</p>
              </div>
              <span className="ml-auto text-xs text-primary font-semibold">Selected</span>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-base mb-3">Order Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special instructions for delivery..."
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-20">
            <h2 className="font-heading font-semibold text-base mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-text truncate">{item.product_name}</p>
                    <p className="text-xs text-slate-400">× {item.quantity} {item.unit}</p>
                  </div>
                  <span className="text-slate-700 shrink-0">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary">{formatPrice(cart.total)}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              loading={placing}
              disabled={!selectedAddress}
              className="w-full mt-5 py-3.5 rounded-xl text-base"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </Button>
            <p className="text-xs text-center text-slate-400 mt-2">
              By placing order, you agree to our Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
