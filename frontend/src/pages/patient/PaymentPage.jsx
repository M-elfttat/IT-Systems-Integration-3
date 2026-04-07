import { useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorAlert, PageHeader } from "../../components/common";
import { paymentService } from "../../services/paymentService";

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const pay = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      const data = await paymentService.create({ appointment_id: Number(appointmentId), amount: Number(amount), method });
      setMsg(`Payment successful: ${data.transaction_ref}`);
    } catch (err) { setError(err?.response?.data?.message || "Payment failed"); }
  };
  return (
    <section>
      <PageHeader title="Payment" subtitle={`Appointment #${appointmentId}`} />
      <form className="card" onSubmit={pay}>
        <ErrorAlert text={error} />
        {msg && <div className="alert success">{msg}</div>}
        <label>Amount<input value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label>Method<select value={method} onChange={(e) => setMethod(e.target.value)}><option value="card">Card</option><option value="wallet">Wallet</option><option value="cash">Cash</option></select></label>
        <button className="btn">Pay Now</button>
      </form>
    </section>
  );
}
