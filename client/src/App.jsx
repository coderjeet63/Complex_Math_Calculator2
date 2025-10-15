import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ==> STEP 1: Backend ka live URL yahaan par define karein
const API_BASE_URL = 'https://complex-math-calculator-backend.onrender.com';

function SolutionGenerator() {
  const [problemType, setProblemType] = useState('pythagorean');
  const [inputs, setInputs] = useState({ a: '3', b: '4' });
  const [solutionHtml, setSolutionHtml] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      // ==> STEP 2: API call mein poora URL istemaal karein
      const res = await axios.get(`${API_BASE_URL}/api/solve/history`);
      if (Array.isArray(res.data)) setHistory(res.data);
      else {
        setHistory([]);
        console.error("History data from API is not an array:", res.data);
      }
    } catch (err) {
      console.error("History fetch failed", err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (problemType === 'pythagorean') {
      setInputs({ a: '3', b: '4' });
    } else {
      // Note: Backend expects 'p', 'r', 't'. Let's match the names.
      setInputs({ p: '5000', amount: '6050', t: '2' });
    }
    setSolutionHtml('');
    setError('');
  }, [problemType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSolutionHtml('');

    try {
      const formattedInputs = Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, parseFloat(value)])
      );
      // ==> STEP 3: API call mein poora URL istemaal karein
      const res = await axios.post(`${API_BASE_URL}/api/solve`, { problemType, inputs: formattedInputs });
      setSolutionHtml(res.data.solutionHtml);
      fetchHistory(); // History ko refresh karein
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const renderInputFields = () => {
    if (problemType === 'pythagorean') {
      return (
        <>
          <div className="flex-1">
            <label htmlFor="a" className="block text-sm font-medium text-gray-700">Side 'a'</label>
            <input type="number" name="a" id="a" value={inputs.a} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="flex-1">
            <label htmlFor="b" className="block text-sm font-medium text-gray-700">Side 'b'</label>
            <input type="number" name="b" id="b" value={inputs.b} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex-1">
            <label htmlFor="p" className="block text-sm font-medium text-gray-700">Principal (P)</label>
            <input type="number" name="p" id="p" value={inputs.p} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="flex-1">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (A)</label>
            <input type="number" name="amount" id="amount" value={inputs.amount} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="flex-1">
            <label htmlFor="t" className="block text-sm font-medium text-gray-700">Time (t) in years</label>
            <input type="number" name="t" id="t" value={inputs.t} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
        </>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Solution Generator</h1>
          <p className="text-lg text-gray-600 mt-2">Solving Math Problems</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Problem Solver</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="problemType" className="block text-sm font-medium text-gray-700">Choose Problem Type</label>
                  <select id="problemType" name="problemType" value={problemType} onChange={(e) => setProblemType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="pythagorean">Pythagorean Theorem</option>
                    <option value="compoundInterest">Compound Interest Rate</option>
                  </select>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputFields()}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors duration-300">
                  {loading ? 'Calculating...' : 'Get Solution'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">History</h2>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {Array.isArray(history) && history.length > 0 ? history.slice(0).reverse().map(item => (
                  <div key={item._id} onClick={() => setSolutionHtml(item.solutionHtml)} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-100 border border-gray-200">
                    <p className="font-semibold text-gray-800">{item.problemType === 'pythagorean' ? 'Pythagorean' : 'Compound Interest'}</p>
                    <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                )) : <p className="text-gray-500">No history yet.</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-2 rounded-xl shadow-md border border-gray-200">
            <div className="w-full h-full rounded-lg overflow-auto">
              {error && <div className="text-red-500 font-bold p-4">{error}</div>}
              {solutionHtml ? (
                <div className="p-4" dangerouslySetInnerHTML={{ __html: solutionHtml }} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Here is the solution</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolutionGenerator;
