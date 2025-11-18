export default function TestCSS() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-neon-green mb-4">CSS Test Page</h1>
      <div className="bg-red-500 p-4 mb-4">
        <p>This should be RED background</p>
      </div>
      <div className="bg-blue-500 p-4 mb-4">
        <p>This should be BLUE background</p>
      </div>
      <div className="bg-green-500 p-4 mb-4">
        <p>This should be GREEN background</p>
      </div>
      <div className="glass-panel p-4 mb-4">
        <p>This should have glass effect</p>
      </div>
      <button className="bg-neon-green text-black px-6 py-3 rounded-lg hover:scale-105 transition">
        Test Button
      </button>
    </div>
  )
}
